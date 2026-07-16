import { LogoutService } from './../services/logout.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { catchError, switchMap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {



  const toastrService = inject(ToastrService);
  const logoutService = inject(LogoutService);
  const authService = inject(AuthService)


  return next(req).pipe(
    catchError((err) => {

      //*this is very importnat function .. thats when token finish ==> go to create new one by refresh token ==> and re-request again 
      //* i need to study switchMap well .. 
      if (
        err.error?.message === 'jwt expired' &&
        !req.url.includes('/users/generate-access-token')
      ) {
        return authService.generateAccessTokenByRefreshToken().pipe(
          switchMap((res) => {

            // Retry the original request.
            // The browser will send the new access-token cookie.
            return next(req);
          }),
          catchError((refreshErr) => {
            toastrService.error('The session takes a period of time');
            //* there is error 'invalid algorism ' when refresh token expired , i need to delete it
            logoutService.signOut("all")
            return throwError(() => refreshErr);
          })
        );
      }



      if (err.error?.message && err.error?.message !== 'jwt expired') {
        toastrService.error(err.error.message);
      }

      return throwError(() => err);
    })
  );



};
