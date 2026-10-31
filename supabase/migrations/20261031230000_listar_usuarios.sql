-- El email vive en auth.users, que la API publica no expone.
-- Esta funcion lo entrega junto al perfil, solo al dueno.
create function public.listar_usuarios()
returns table (
  usuario_id uuid,
  nombre text,
  email text,
  rol text,
  estado text,
  fecha_creacion timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.es_duenio() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  return query
  select p.id, p.nombre, u.email::text, p.rol, p.estado, p.fecha_creacion
  from public.perfiles p
  join auth.users u on u.id = p.id
  order by p.fecha_creacion;
end;
$$;

revoke execute on function public.listar_usuarios() from public, anon;
grant execute on function public.listar_usuarios() to authenticated;
