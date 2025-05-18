import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'heroes',
    loadComponent: () => import('./pages/heroes/heroes.page').then( m => m.HeroesPage)
  },
  {
    path: 'heroe/:id/:accion',
    loadComponent: () => import('./pages/heroe/heroe.page').then( m => m.HeroePage)
  },
];
