import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./products/features/product-shell/product.route'),
  },
  { path: 'cart', loadChildren: () => import('./cart/cart.routes') },
  {
    path: '**',
    redirectTo: '',
  },
];
