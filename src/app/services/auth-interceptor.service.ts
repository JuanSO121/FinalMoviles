import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { catchError, from, of, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  
  // Verificar si estamos haciendo login (no necesita token)
  if (req.url.includes('/auth/login')) {
    console.log('Petición de login, no se requiere token');
    return next(req);
  }
  
  // Para todas las demás peticiones, intentar obtener y adjuntar el token
  return from(storageService.getCookie()).pipe(
    switchMap(token => {
      if (token) {
        console.log('Interceptor: añadiendo token a la petición');
        // Clone the request and add the auth header
        const authReq = req.clone({
          setHeaders: { 'x-token': token }
        });
        return next(authReq);
      } else {
        console.warn('No hay token disponible para la petición:', req.url);
        // Si no hay token disponible, intentar recuperarlo una vez más
        return from(storageService.attemptTokenRecovery()).pipe(
          switchMap(recoveredToken => {
            if (recoveredToken) {
              console.log('Token recuperado de emergencia');
              const authReq = req.clone({
                setHeaders: { 'x-token': recoveredToken }
              });
              return next(authReq);
            }
            console.error('No se pudo recuperar un token. Continuando sin autenticación.');
            return next(req);
          }),
          catchError(error => {
            console.error('Error en el interceptor:', error);
            // Asegurarnos de que los errores no bloquean la aplicación
            return next(req);
          })
        );
      }
    }),
    catchError(error => {
      console.error('Error crítico en el interceptor:', error);
      // Si hay cualquier error en el interceptor, dejamos pasar la petición original
      return next(req);
    })
  );
};