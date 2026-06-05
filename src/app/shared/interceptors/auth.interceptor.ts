import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);

  // No agregar token a peticiones externas (ej: Cloudinary)
  if (req.url.startsWith('https://api.cloudinary.com')) {
    return next(req);
  }

  // Obtener el token del localStorage
  const token = storageService.getToken();

  // Si hay token, agregarlo a los headers como Bearer
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
