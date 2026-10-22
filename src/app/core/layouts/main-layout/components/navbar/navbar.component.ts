import { LogoutService } from './../../../../services/logout.service';
import { ProfileDataService } from './../../../../services/profile-data.service';
import { AfterViewInit, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink } from "@angular/router";
import { IUser } from '../../../../interfaces/user-info';
import { SocketService } from '../../../../socket/socket.service';
import { environment } from '../../../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { JwtUserPayload } from '../../../../interfaces/jwt-user-payload';



@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit, AfterViewInit {

  private readonly profileDataService = inject(ProfileDataService)
  private readonly logoutService = inject(LogoutService)
  private readonly socketService = inject(SocketService)
  userInfo: WritableSignal<IUser> = signal({} as IUser)
  backendUrlStatic: string = `${environment.baseUrl}/uploads/`

  private readonly cookieService = inject(CookieService);
  protected decoded: JwtUserPayload = {} as JwtUserPayload

  ngOnInit(): void {

    this.getProfileInfos()
  }

  ngAfterViewInit(): void {
    setTimeout(() => initFlowbite());
  }



  getProfileInfos() {


    this.decoded = jwtDecode(this.cookieService.get('accessToken'));


    this.profileDataService.getProfileData(this.decoded.id).subscribe({
      next: (res) => {
        console.log("======", res, '======');
        this.userInfo.set(res.data)
        localStorage.setItem('id', res.data._id)
        localStorage.setItem('provider', res.data.provider.toString())


        this.socketService.connect();

      }
    })
  }


  signout() {

    this.logoutService.signOut('one')
  }

}
