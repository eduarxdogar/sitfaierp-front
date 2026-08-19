import os
import re

def replace_in_file(filepath, pattern, replacement, is_regex=True):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if is_regex:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)
    else:
        content = content.replace(pattern, replacement)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed: {filepath}")

# Phase 1: index.html
replace_in_file(
    'index.html',
    r'<link href="https://fonts\.googleapis\.com/css2\?family=Material\+Symbols\+Outlined:.*?" rel="stylesheet" />',
    '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />'
)

# Phase 2: Sidebar.vue
nav_items_replacement = """const navItems = ref([
  { id: 'dashboard', label: 'Dashboard Ejecutivo', icon: 'dashboard', route: '/dashboard' },
  { id: 'iam', label: 'Identidad y Accesos (IAM)', icon: 'shield_person', route: '#' },
  { id: 'tenant-branches', label: 'Gestión de Empresas', icon: 'domain', route: '/empresas' },
  { id: 'sales', label: 'Órdenes y Ventas', icon: 'receipt_long', route: '#' },
  { id: 'inventory', label: 'Auditoría y Tomas Físicas', icon: 'inventory_2', route: '#' },
  { id: 'billing', label: 'Facturación Fiscal', icon: 'request_quote', route: '#' },
  { id: 'pos', label: 'Puntos de Venta (POS)', icon: 'point_of_sale', route: '#' }
]);"""

replace_in_file('src/shared/components/layout/Sidebar.vue', r'const navItems = ref\(\[[\s\S]*?\]\);', nav_items_replacement)
replace_in_file('src/shared/components/layout/Sidebar.vue', r'<span>Configuraci.*?n</span>', '<span>Configuración</span>')
replace_in_file('src/shared/components/layout/Sidebar.vue', r'<span>Cerrar Sesi.*?n</span>', '<span>Cerrar Sesión</span>')

# Phase 3: build-url.ts
build_url_replacement = """const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
  const finalUrl = f"{base}/{cleanUrl}".replace("f\\"{base}/{cleanUrl}\\"", "`\\${base}/\\${cleanUrl}`");

  if (!params) return finalUrl;

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? finalUrl + "?" + queryString : finalUrl;
}
"""
build_url_replacement = build_url_replacement.replace('f"{base}/{cleanUrl}".replace("f\\"{base}/{cleanUrl}\\"", "`\\${base}/\\${cleanUrl}`")', '`${base}/${cleanUrl}`')
build_url_replacement = build_url_replacement.replace('finalUrl + "?" + queryString', '`${finalUrl}?${queryString}`')

replace_in_file('src/shared/services/http/build-url.ts', r'const API_URL[\s\S]*', build_url_replacement)

# Phase 4: empresas-page.vue
replace_in_file('src/features/empresas/empresas-page.vue', r"useSimpleQueryHook<EmpresaResponse\[\]>\(\{[\s\S]*?url: 'empresas'[\s\S]*?\}\)", "useSimpleQueryHook<EmpresaResponse[]>({ queryKey: ['empresas'], url: 'empresas' })")
replace_in_file('src/features/empresas/empresas-page.vue', r"useSimpleMutationHook<EmpresaResponse, CrearEmpresaRequest>\(\{[\s\S]*?url: 'empresas'[\s\S]*?method: 'POST'[\s\S]*?\}\)", "useSimpleMutationHook<EmpresaResponse, CrearEmpresaRequest>({ url: 'empresas', method: 'POST' })")

