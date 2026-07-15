import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {


  const router = inject(Router)
  const authService = inject(AuthService)


  return authService.checkAuth().pipe(
    map((response) => response.auth ? true : router.parseUrl('/login')),
    catchError(() => of(router.parseUrl('/login')))
  );

};
