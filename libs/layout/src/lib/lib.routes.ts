import { Route } from '@angular/router';

export const layoutRoutes: Route[] = [
  { path: '', loadComponent: () => import('./layout/layout.component') },
];
