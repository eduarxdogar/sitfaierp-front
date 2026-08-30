import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/ui/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: '',
    loadComponent: () => import('./pages/layout/ui/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'ui-kit',
        loadComponent: () => import('./pages/ui-kit-page/ui/ui-kit-page.component').then(m => m.UiKitPageComponent)
      },
      {
        path: 'iam',
        loadComponent: () => import('./pages/iam-page/ui/iam-page.component').then(m => m.IamPageComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./pages/pedidos-page/ui/pedidos-page.component').then(m => m.PedidosPageComponent)
      },
      {
        path: '',
        redirectTo: 'ui-kit',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
