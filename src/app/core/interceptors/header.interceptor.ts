import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);

  if (cookieService.check('accessToken') && req.url.startsWith(environment.baseUrl)) {
    req = req.clone(
      {
        // setHeaders: { authorization: 'Bearer' + cookieService.get('accessToken') }

        //withCredentials: true ==> mean Browser, send the backend cookies with the request.
        withCredentials: true

      }
    )
  }


  return next(req);
};
