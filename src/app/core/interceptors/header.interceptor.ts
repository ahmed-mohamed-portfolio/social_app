import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);

  if (cookieService.check('token')) {
    req = req.clone(
      {
        setHeaders: { authorization: 'Bearer' + cookieService.get('accessToken') }
      }
    )
  }


  return next(req);
};
