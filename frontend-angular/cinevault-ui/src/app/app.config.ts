import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http'; 
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // This line forces Angular to use your Interceptor on EVERY single request!
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()) 
  ]
};