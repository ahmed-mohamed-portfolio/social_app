import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private http = inject(HttpClient)
  private readonly router: Router = inject(Router)
  private readonly toastrService: ToastrService = inject(ToastrService)



  signOut(flag: string) {

    switch (flag) {
      case "all":

        this.logOutFromAllDevices().subscribe({
          next: (res) => {
            this.router.navigate(['/login'])
            this.toastrService.info("You have successfully logged out.", "Logout Successful")
          },
          error: (err) => {
            console.log(err);
          }
        })

        break;

      case "one":

        this.logOutFromTHisDevice().subscribe({
          next: (res) => {
            this.router.navigate(['/login'])
            this.toastrService.info("You have successfully logged out.", "Logout Successful")

          },
          error: (err) => {
            console.log(err);
          }
        })

        break;

      case 'out':

        this.router.navigate(['/login'])
        this.toastrService.info("You have successfully logged out.", "Logout Successful")
        break;

      default:
        console.log("problem in sign out");

        break;
    }





  }

  logOutFromAllDevices(): Observable<any> {
    return this.http.patch(environment.baseUrl + 'users/logout-from-all-devices', {})
  }

  logOutFromTHisDevice(): Observable<any> {
    return this.http.post(environment.baseUrl + 'users/logout', {})
  }

}
