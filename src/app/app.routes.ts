import { Routes } from '@angular/router';
import { Mapchart } from './pages/charts/mapchart/mapchart';
import { Mapchart1 } from './pages/charts/mapchart1/mapchart1';
import { Mapchart2 } from './pages/charts/mapchart2/mapchart2';
import { Mapchart4 } from './pages/charts/mapchart4/mapchart4';
import { Mapchart5 } from './pages/charts/mapchart5/mapchart5';
import { Mapchart6 } from './pages/charts/mapchart6/mapchart6';
import { Mapchart7 } from './pages/charts/mapchart7/mapchart7';
import { Mapchart8 } from './pages/charts/mapchart8/mapchart8';
import { Mapchart9 } from './pages/charts/mapchart9/mapchart9';
import { Layout } from './pages/shared/layout/layout';
import { Dashboard } from './pages/charts/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'map',
    component: Mapchart
  },
  {
    path: 'map2',
    component: Mapchart1
  },
  {
    path: 'map4',
    component: Mapchart4
  },
  {
    path: 'map5',
    component: Mapchart5
  },
  {
    path: 'map6',
    component: Mapchart6
  },
  // {
  //     path: 'map7',
  //     component: Mapchart7
  // },
  {
    path: 'map8',
    component: Mapchart8
  },
  {
    path: 'map9',
    component: Mapchart9
  },
  {
    path: '',
    redirectTo: 'chart',
    pathMatch: 'full'
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'chart', component: Mapchart7 }, // with filename
      { path: 'dashboard', component: Dashboard }, // with filename
      {
        path: 'map3',
        component: Mapchart2
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];


// export const routes: Routes = [
//   {
//     path: '',
//     component: Layout,
//     children: [
//       { path: 'chart/create-new-chart', component: Mapchart7 },           // no filename
//       { path: 'chart/:filename', component: Mapchart7 }, // with filename
//       { path: '', redirectTo: 'chart', pathMatch: 'full' }
//     ]
//   },
//   { path: '**', redirectTo: '' }
// ];

// export const routes: Routes = [
//   {
//     path: '',
//     component: Layout,
//     children: [
//       { path: 'chart', component: Mapchart7 }, // with filename
//       { path: '', redirectTo: 'chart', pathMatch: 'full' }
//     ]
//   },
//   { path: '**', redirectTo: '' }
// ];

