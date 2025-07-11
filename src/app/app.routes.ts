import { Routes } from '@angular/router';
import { Mapchart } from './mapchart/mapchart';
import { Mapchart1 } from './mapchart1/mapchart1';
import { Mapchart2 } from './mapchart2/mapchart2';
import { Mapchart4 } from './mapchart4/mapchart4';

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
        path: 'map3',
        component: Mapchart2
    },
    {
        path: 'map4',
        component: Mapchart4
    },
    {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full'
    },
];
