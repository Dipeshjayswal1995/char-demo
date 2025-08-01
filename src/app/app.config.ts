import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideHighcharts } from 'highcharts-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideHighcharts(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
