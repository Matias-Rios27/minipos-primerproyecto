-- Funciones de negocio que antes vivian en el backend Express.
-- Estado: PENDIENTE de aplicar en Supabase (proyecto mini-pos).

-- ---------------------------------------------------------------------------
-- 1. Gastos automaticos por compra inicial o reabastecimiento de stock.
--    Se omiten si la transaccion define app.sin_gasto_auto = '1'
--    (anular venta, editar venta e importaciones).
-- ---------------------------------------------------------------------------
create function private.gasto_por_stock()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_delta integer;
begin
  if current_setting('app.sin_gasto_auto', true) = '1' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.stock > 0 and new.precio > 0 then
      insert into public.gastos (usuario_id, descripcion, monto)
      values (
        auth.uid(),
        format('Compra de inventario inicial: %s (%s unids)', new.nombre, new.stock),
        new.stock * new.precio
      );
    end if;
  elsif new.stock > old.stock and new.precio > 0 then
    v_delta := new.stock - old.stock;
    insert into public.gastos (usuario_id, descripcion, monto)
    values (
      auth.uid(),
      format('Reabastecimiento de stock: %s (+%s unids)', new.nombre, v_delta),
      v_delta * new.precio
    );
  end if;

  return new;
end;
$$;

create trigger gasto_por_stock_insert
after insert on public.productos
for each row execute function private.gasto_por_stock();

create trigger gasto_por_stock_update
after update of stock on public.productos
for each row
when (new.stock > old.stock)
execute function private.gasto_por_stock();

-- ---------------------------------------------------------------------------
-- 2. Crear venta: precios y total salen de la base, no del cliente.
--    p_items = [{"producto_id": 1, "cantidad": 2}, ...]
-- ---------------------------------------------------------------------------
create function public.crear_venta(p_items jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_venta integer;
  v_item record;
  v_prod record;
  v_subtotal numeric;
  v_total numeric := 0;
begin
  if not private.es_activo() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'La venta no tiene productos';
  end if;

  insert into public.ventas (usuario_id, total)
  values (auth.uid(), 0)
  returning venta_id into v_venta;

  for v_item in
    select (e ->> 'producto_id')::integer as producto_id,
           sum((e ->> 'cantidad')::integer) as cantidad
    from jsonb_array_elements(p_items) e
    group by 1
    order by 1
  loop
    if v_item.cantidad is null or v_item.cantidad <= 0 then
      raise exception 'Cantidad invalida para el producto %', v_item.producto_id;
    end if;

    select * into v_prod
    from public.productos
    where producto_id = v_item.producto_id
    for update;

    if not found or not v_prod.activo then
      raise exception 'Producto no disponible: %', v_item.producto_id;
    end if;
    if v_prod.stock < v_item.cantidad then
      raise exception 'Stock insuficiente para %: disponible %', v_prod.nombre, v_prod.stock;
    end if;

    v_subtotal := v_prod.precio * v_item.cantidad;

    insert into public.detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal)
    values (v_venta, v_prod.producto_id, v_item.cantidad, v_prod.precio, v_subtotal);

    update public.productos
    set stock = stock - v_item.cantidad
    where producto_id = v_prod.producto_id;

    v_total := v_total + v_subtotal;
  end loop;

  update public.ventas set total = v_total where venta_id = v_venta;

  return v_venta;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Anular venta: devuelve el stock y borra la venta (solo dueno).
-- ---------------------------------------------------------------------------
create function public.anular_venta(p_venta_id integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.es_duenio() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  perform set_config('app.sin_gasto_auto', '1', true);

  perform 1 from public.ventas where venta_id = p_venta_id for update;
  if not found then
    raise exception 'Venta no encontrada';
  end if;

  update public.productos p
  set stock = p.stock + d.cantidad
  from (
    select producto_id, sum(cantidad) as cantidad
    from public.detalle_venta
    where venta_id = p_venta_id
    group by producto_id
  ) d
  where p.producto_id = d.producto_id;

  delete from public.ventas where venta_id = p_venta_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Editar venta: repone el stock anterior y aplica los items nuevos (solo dueno).
--    Corrige el backend original, que no ajustaba el stock al editar.
-- ---------------------------------------------------------------------------
create function public.editar_venta(p_venta_id integer, p_items jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_precios jsonb;
  v_item record;
  v_prod record;
  v_precio numeric;
  v_subtotal numeric;
  v_total numeric := 0;
begin
  if not private.es_duenio() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'La venta debe tener al menos un producto; para eliminarla use anular_venta';
  end if;

  perform set_config('app.sin_gasto_auto', '1', true);

  perform 1 from public.ventas where venta_id = p_venta_id for update;
  if not found then
    raise exception 'Venta no encontrada';
  end if;

  select coalesce(jsonb_object_agg(producto_id::text, precio_unitario), '{}'::jsonb)
  into v_precios
  from public.detalle_venta
  where venta_id = p_venta_id;

  update public.productos p
  set stock = p.stock + d.cantidad
  from (
    select producto_id, sum(cantidad) as cantidad
    from public.detalle_venta
    where venta_id = p_venta_id
    group by producto_id
  ) d
  where p.producto_id = d.producto_id;

  delete from public.detalle_venta where venta_id = p_venta_id;

  for v_item in
    select (e ->> 'producto_id')::integer as producto_id,
           sum((e ->> 'cantidad')::integer) as cantidad
    from jsonb_array_elements(p_items) e
    group by 1
    order by 1
  loop
    if v_item.cantidad is null or v_item.cantidad <= 0 then
      raise exception 'Cantidad invalida para el producto %', v_item.producto_id;
    end if;

    select * into v_prod
    from public.productos
    where producto_id = v_item.producto_id
    for update;

    if not found then
      raise exception 'Producto no encontrado: %', v_item.producto_id;
    end if;
    if v_prod.stock < v_item.cantidad then
      raise exception 'Stock insuficiente para %: disponible %', v_prod.nombre, v_prod.stock;
    end if;

    -- se respeta el precio original de la venta si el producto ya estaba
    v_precio := coalesce((v_precios ->> v_item.producto_id::text)::numeric, v_prod.precio);
    v_subtotal := v_precio * v_item.cantidad;

    insert into public.detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal)
    values (p_venta_id, v_prod.producto_id, v_item.cantidad, v_precio, v_subtotal);

    update public.productos
    set stock = stock - v_item.cantidad
    where producto_id = v_prod.producto_id;

    v_total := v_total + v_subtotal;
  end loop;

  update public.ventas set total = v_total where venta_id = p_venta_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard: misma forma de respuesta que el endpoint /api/dashboard.
--    Las fechas se agrupan en hora de Chile (America/Santiago).
-- ---------------------------------------------------------------------------
create function public.dashboard_stats(p_periodo text default 'mes')
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  v_tz constant text := 'America/Santiago';
  v_ahora timestamp := now() at time zone 'America/Santiago';
  v_periodo text := lower(coalesce(p_periodo, 'mes'));
  v_desde timestamptz;
  v_hasta timestamptz;
  v_unidad text;
  v_fmt text;
  v_ingresos numeric;
  v_ventas integer;
  v_gastos numeric;
  v_utilidad numeric;
  v_top jsonb;
  v_flujo jsonb;
  v_dist jsonb;
begin
  if not private.es_activo() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  if v_periodo = 'semana' then
    v_desde := now() - interval '7 days';
    v_hasta := 'infinity'::timestamptz;
    v_unidad := 'day';
    v_fmt := 'Dy';
  elsif v_periodo = 'año' then
    v_desde := date_trunc('year', v_ahora) at time zone v_tz;
    v_hasta := (date_trunc('year', v_ahora) + interval '1 year') at time zone v_tz;
    v_unidad := 'month';
    v_fmt := 'Mon';
  else
    v_desde := date_trunc('month', v_ahora) at time zone v_tz;
    v_hasta := (date_trunc('month', v_ahora) + interval '1 month') at time zone v_tz;
    v_unidad := 'day';
    v_fmt := 'DD';
  end if;

  select coalesce(sum(total), 0), count(*)::integer
  into v_ingresos, v_ventas
  from public.ventas
  where fecha_venta >= v_desde and fecha_venta < v_hasta;

  select coalesce(sum(monto), 0)
  into v_gastos
  from public.gastos
  where fecha_gasto >= v_desde and fecha_gasto < v_hasta;

  v_utilidad := v_ingresos - v_gastos;

  select coalesce(jsonb_agg(jsonb_build_object(
      'producto_id', producto_id,
      'nombre', nombre,
      'total_vendido', total_vendido,
      'total_monto', total_monto,
      'porcentaje', round(total_vendido * 100.0 / nullif(max_vendido, 0))::integer
    ) order by total_vendido desc), '[]'::jsonb)
  into v_top
  from (
    select p.producto_id, p.nombre,
           sum(dv.cantidad)::integer as total_vendido,
           sum(dv.subtotal) as total_monto,
           max(sum(dv.cantidad)) over () as max_vendido
    from public.detalle_venta dv
    join public.ventas v on v.venta_id = dv.venta_id
    join public.productos p on p.producto_id = dv.producto_id
    where v.fecha_venta >= v_desde and v.fecha_venta < v_hasta
    group by p.producto_id, p.nombre
    order by total_vendido desc
    limit 4
  ) t;

  select coalesce(jsonb_agg(jsonb_build_object(
      'label', to_char(fecha, v_fmt),
      'ingresos', ingresos,
      'num_ventas', num_ventas
    ) order by fecha), '[]'::jsonb)
  into v_flujo
  from (
    select date_trunc(v_unidad, v.fecha_venta at time zone v_tz) as fecha,
           sum(v.total) as ingresos,
           count(*)::integer as num_ventas
    from public.ventas v
    where v.fecha_venta >= v_desde and v.fecha_venta < v_hasta
    group by 1
  ) t;

  select coalesce(jsonb_agg(jsonb_build_object(
      'categoria', coalesce(categoria, 'Sin categoría'),
      'total', total,
      'cantidad', cantidad,
      'porcentaje', case when v_gastos > 0 then round(total * 100 / v_gastos)::integer else 0 end
    ) order by total desc), '[]'::jsonb)
  into v_dist
  from (
    select cg.nombre as categoria, sum(g.monto) as total, count(g.gasto_id)::integer as cantidad
    from public.gastos g
    left join public.categoria_gasto cg on cg.categoria_id = g.categoria_id
    where g.fecha_gasto >= v_desde and g.fecha_gasto < v_hasta
    group by cg.nombre
  ) t;

  return jsonb_build_object(
    'periodo', p_periodo,
    'totalIngresos', v_ingresos,
    'totalVentas', v_ventas,
    'totalGastos', v_gastos,
    'utilidadNeta', v_utilidad,
    'ticketPromedio', case when v_ventas > 0 then v_ingresos / v_ventas else 0 end,
    'margenGanancia', case when v_ingresos > 0 then round(v_utilidad * 100 / v_ingresos)::integer else 0 end,
    'topProductos', v_top,
    'flujoCaja', v_flujo,
    'gastosDistribucion', v_dist
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Balance de los ultimos 6 meses: misma forma que /api/dashboard/balance.
--    El porcentaje de la distribucion de gastos se calcula sobre el total del
--    mes actual (el backend original lo dividia por el total de 6 meses).
-- ---------------------------------------------------------------------------
create function public.balance_historico()
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  v_tz constant text := 'America/Santiago';
  v_hist jsonb;
  v_act jsonb;
  v_prev jsonb;
  v_cambio_ing integer;
  v_cambio_gas integer;
  v_gastos_mes numeric;
  v_dist jsonb;
begin
  if not private.es_activo() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  with ing as (
    select date_trunc('month', fecha_venta at time zone v_tz) as m,
           sum(total) as ingresos, count(*) as ventas
    from public.ventas
    where fecha_venta >= now() - interval '6 months'
    group by 1
  ), gas as (
    select date_trunc('month', fecha_gasto at time zone v_tz) as m,
           sum(monto) as gastos
    from public.gastos
    where fecha_gasto >= now() - interval '6 months'
    group by 1
  ), h as (
    select coalesce(i.m, g.m) as m,
           coalesce(i.ingresos, 0) as ingresos,
           coalesce(g.gastos, 0) as gastos,
           coalesce(i.ventas, 0) as ventas
    from ing i full join gas g on g.m = i.m
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'mes', to_char(m, 'Mon YYYY'),
      'ingresos', ingresos,
      'gastos', gastos,
      'utilidad', ingresos - gastos,
      'margen', case when ingresos > 0 then round((ingresos - gastos) * 100 / ingresos)::integer else 0 end,
      'ventas', ventas
    ) order by m), '[]'::jsonb)
  into v_hist
  from h;

  v_act := coalesce(v_hist -> -1,
    jsonb_build_object('ingresos', 0, 'gastos', 0, 'utilidad', 0, 'margen', 0));
  v_prev := coalesce(v_hist -> -2,
    jsonb_build_object('ingresos', 0, 'gastos', 0));

  v_cambio_ing := case when (v_prev ->> 'ingresos')::numeric > 0
    then round(((v_act ->> 'ingresos')::numeric - (v_prev ->> 'ingresos')::numeric) * 100
               / (v_prev ->> 'ingresos')::numeric)::integer
    else 0 end;
  v_cambio_gas := case when (v_prev ->> 'gastos')::numeric > 0
    then round(((v_act ->> 'gastos')::numeric - (v_prev ->> 'gastos')::numeric) * 100
               / (v_prev ->> 'gastos')::numeric)::integer
    else 0 end;

  select coalesce(sum(monto), 0)
  into v_gastos_mes
  from public.gastos
  where date_trunc('month', fecha_gasto at time zone v_tz) = date_trunc('month', now() at time zone v_tz);

  select coalesce(jsonb_agg(jsonb_build_object(
      'categoria', coalesce(categoria, 'Sin categoría'),
      'total', total,
      'porcentaje', case when v_gastos_mes > 0 then round(total * 100 / v_gastos_mes)::integer else 0 end
    ) order by total desc), '[]'::jsonb)
  into v_dist
  from (
    select cg.nombre as categoria, sum(g.monto) as total
    from public.gastos g
    left join public.categoria_gasto cg on cg.categoria_id = g.categoria_id
    where date_trunc('month', g.fecha_gasto at time zone v_tz) = date_trunc('month', now() at time zone v_tz)
    group by cg.nombre
  ) t;

  return jsonb_build_object(
    'mesActual', v_act,
    'cambioIngresos', v_cambio_ing,
    'cambioGastos', v_cambio_gas,
    'historico', v_hist,
    'gastosDistribucion', v_dist
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Permisos: solo usuarios autenticados llaman a las funciones publicas.
-- ---------------------------------------------------------------------------
revoke execute on function public.crear_venta(jsonb) from public, anon;
revoke execute on function public.anular_venta(integer) from public, anon;
revoke execute on function public.editar_venta(integer, jsonb) from public, anon;
revoke execute on function public.dashboard_stats(text) from public, anon;
revoke execute on function public.balance_historico() from public, anon;
grant execute on function public.crear_venta(jsonb) to authenticated;
grant execute on function public.anular_venta(integer) to authenticated;
grant execute on function public.editar_venta(integer, jsonb) to authenticated;
grant execute on function public.dashboard_stats(text) to authenticated;
grant execute on function public.balance_historico() to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Imagenes de productos: lectura publica por URL, escritura solo del dueno.
--    Reemplaza la subida a Cloudinary, que dependia de un secreto del backend.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('productos', 'productos', true, 2097152,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do nothing;

create policy "dueno sube imagenes" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'productos' and (select private.es_duenio()));
create policy "dueno actualiza imagenes" on storage.objects
  for update to authenticated
  using (bucket_id = 'productos' and (select private.es_duenio()));
create policy "dueno borra imagenes" on storage.objects
  for delete to authenticated
  using (bucket_id = 'productos' and (select private.es_duenio()));
