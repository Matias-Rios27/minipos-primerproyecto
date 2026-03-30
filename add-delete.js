const fs = require('fs');

const files = [
  'app/Main/page.tsx',
  'app/listaproveedores/page.tsx',
  'app/inventario/page.tsx',
  'app/historial/[id]/page.tsx',
  'app/historial/page.tsx',
  'app/gastos/page.tsx',
  'app/editarproveedor/page.tsx',
  'app/editarproducto/[id]/page.tsx',
  'app/dashboard/page.tsx',
  'app/agregarproducto/page.tsx',
  'app/agregarproveedor/page.tsx'
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // 1. Add import 'deleteNotificacion'
    if (content.includes('getNotificaciones') && !content.includes('deleteNotificacion')) {
      content = content.replace(/(import\s+\{.*)getNotificaciones(.*\}\s+from\s+["']@\/lib\/api["'];?)/, '$1getNotificaciones, deleteNotificacion$2');
      modified = true;
    }

    // 2. Add handler
    const handlerStr = `
  const handleDeleteNotificacion = async (id: number) => {
    try {
      await deleteNotificacion(id);
      setAlertas(prev => prev.filter(a => a.notificacion_id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

`;
    if (!content.includes('handleDeleteNotificacion') && content.includes('setAlertas')) {
      content = content.replace(/(\s+)(return\s*\(\s*<(div|ProtectedRoute))/i, `$1${handlerStr}$1$2`);
      modified = true;
    }

    // 3. Add delete button in the alert mapping
    if (content.includes('alertas.map')) {
      const itemRegex = /<div\s+key=\{alerta\.notificacion_id\}[^>]*>[\s\S]*?<div className="flex gap-3 text-xs">[\s\S]*?<div>\s*<p className="font-bold">\{alerta\.mensaje\}<\/p>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
      
      content = content.replace(itemRegex, (match) => {
        if (match.includes('handleDeleteNotificacion')) return match;
        
        // Add flex-1 to the inner div to push the button right
        let replaced = match.replace('<div className="flex gap-3 text-xs">', '<div className="flex gap-3 text-xs items-center justify-between">');
        replaced = replaced.replace('<div>', '<div className="flex-1">');
        
        // Insert button before the second to last closing div
        const insertPosition = replaced.lastIndexOf('</div>', replaced.lastIndexOf('</div>') - 1);
        const buttonHTML = `
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteNotificacion(alerta.notificacion_id); }}
                                className="text-rose-500 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-lg transition-colors ml-2"
                                title="Eliminar notificación"
                              >
                                ❌
                              </button>
                            </div>`;
        return replaced.substring(0, insertPosition) + buttonHTML + replaced.substring(insertPosition + 6);
      });
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error processing ${file}:`, err);
    }
  }
}
console.log('Script completed.');
