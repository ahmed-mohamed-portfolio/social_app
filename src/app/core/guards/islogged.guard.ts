import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isloggedGuard: CanActivateFn = (route, state) => {

    const router: Router = inject(Router)


  if (localStorage.getItem("token")) {

    return router.parseUrl('/home')

  }

  return true



};
