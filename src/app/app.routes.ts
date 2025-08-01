import { Routes } from '@angular/router';
import { Mapchart } from './mapchart/mapchart';
import { Mapchart1 } from './mapchart1/mapchart1';
import { Mapchart2 } from './mapchart2/mapchart2';
import { Mapchart4 } from './mapchart4/mapchart4';
import { Mapchart5 } from './mapchart5/mapchart5';
import { Mapchart6 } from './mapchart6/mapchart6';
import { Mapchart7 } from './mapchart7/mapchart7';
import { Mapchart8 } from './mapchart8/mapchart8';
import { Mapchart9 } from './mapchart9/mapchart9';

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
        path: 'map5',
        component: Mapchart5
    },
    {
        path: 'map6',
        component: Mapchart6
    },
    {
        path: 'map7',
        component: Mapchart7
    },
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
        redirectTo: 'map7',
        pathMatch: 'full'
    },
];
