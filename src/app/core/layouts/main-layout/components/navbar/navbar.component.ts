import { LogoutService } from './../../../../services/logout.service';
import { ProfileDataService } from './../../../../services/profile-data.service';
import { AfterViewInit, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from "@angular/router";
import { IUser, User } from '../../../../interfaces/user-info';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit, AfterViewInit {

  private readonly profileDataService = inject(ProfileDataService)
  private readonly logoutService = inject(LogoutService)
  private router = inject(Router)
  userInfo: WritableSignal<IUser> = signal({} as IUser)
  backendUrlStatic: string = 'http://localhost:3000/uploads/'

  ngOnInit(): void {

    this.getProfileInfos()
  }

  ngAfterViewInit(): void {
    setTimeout(() => initFlowbite());
  }

  getProfileInfos() {
    this.profileDataService.getProfileData().subscribe({
      next: (res) => {
        console.log("======", res, '=======');
        this.userInfo.set(res.data)
        localStorage.setItem('id', res.data._id)
      }
    })
  }


  signout() {

    this.logoutService.signOut('one')
  }

}
