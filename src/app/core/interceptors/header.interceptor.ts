import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);

  if (cookieService.check('accessToken')) {
    req = req.clone(
      {
        // setHeaders: { authorization: 'Bearer' + cookieService.get('accessToken') }

        withCredentials: true

      }
    )
  }


  return next(req);
};
