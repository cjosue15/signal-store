import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./cart.component'),
  },
] as Routes;
