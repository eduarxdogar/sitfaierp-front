const fs = require('fs');
const path = require('path');

// Helper
const replaceInFile = (filePath, regexOrString, replacement) => {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(regexOrString, replacement);
  fs.writeFileSync(fullPath, content, 'utf8');
};

// Phase 1: index.html
replaceInFile(
  'D:/devs/sitfai-front/index.html',
  /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:.*?" rel="stylesheet" \/>/g,
  '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />'
);

// Phase 2: Sidebar.vue
replaceInFile(
  'D:/devs/sitfai-front/src/shared/components/layout/Sidebar.vue',
  /const navItems = ref\(\[\s*([\s\S]*?)\]\);/,
  const navItems = ref([
  { id: 'dashboard', label: 'Dashboard Ejecutivo', icon: 'dashboard', route: '/dashboard' },
  { id: 'iam', label: 'Identidad y Accesos (IAM)', icon: 'shield_person', route: '#' },
  { id: 'tenant-branches', label: 'Gestión de Empresas', icon: 'domain', route: '/empresas' },
  { id: 'sales', label: 'Órdenes y Ventas', icon: 'receipt_long', route: '#' },
  { id: 'inventory', label: 'Auditoría y Tomas Físicas', icon: 'inventory_2', route: '#' },
  { id: 'billing', label: 'Facturación Fiscal', icon: 'request_quote', route: '#' },
  { id: 'pos', label: 'Puntos de Venta (POS)', icon: 'point_of_sale', route: '#' }
]);
);
replaceInFile(
  'D:/devs/sitfai-front/src/shared/components/layout/Sidebar.vue',
  /<span>Configuraci.*n<\/span>/,
  '<span>Configuración</span>'
);
replaceInFile(
  'D:/devs/sitfai-front/src/shared/components/layout/Sidebar.vue',
  /<span>Cerrar Sesi.*n<\/span>/,
  '<span>Cerrar Sesión</span>'
);

// Phase 3: build-url.ts
replaceInFile(
  'D:/devs/sitfai-front/src/shared/services/http/build-url.ts',
  /const API_URL[\s\S]*/,
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function buildUrl(url: any, params?: object): string {
  let cleanUrl = "";
  if (typeof url === "string") {
    cleanUrl = url;
  } else if (typeof url === "object" && url !== null && url.url) {
    cleanUrl = url.url;
  } else {
    cleanUrl = String(url);
  }

  if (cleanUrl.startsWith("/")) cleanUrl = cleanUrl.substring(1);

  const base = API_URL.endsWith("/") ? API_URL.substring(0, API_URL.length - 1) : API_URL;
  const finalUrl = \\/\\;

  if (!params) return finalUrl;

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? \\?\\ : finalUrl;
}

);

// Phase 4: empresas-page.vue
replaceInFile(
  'D:/devs/sitfai-front/src/features/empresas/empresas-page.vue',
  /useSimpleQueryHook<EmpresaResponse\[\]>\(\{\s*queryKey:\s*\['empresas'\],\s*url:\s*'empresas'\s*\}\)/g,
  useSimpleQueryHook<EmpresaResponse[]>({ queryKey: ['empresas'], url: 'empresas' })
);
replaceInFile(
  'D:/devs/sitfai-front/src/features/empresas/empresas-page.vue',
  /useSimpleMutationHook<EmpresaResponse, CrearEmpresaRequest>\(\{\s*url:\s*'empresas',\s*method:\s*'POST',?\s*\}\)/g,
  useSimpleMutationHook<EmpresaResponse, CrearEmpresaRequest>({ url: 'empresas', method: 'POST' })
);

console.log('✅ Archivos procesados con Node.js en UTF-8 nativo.');
