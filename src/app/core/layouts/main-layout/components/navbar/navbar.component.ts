import { ProfileDataService } from './../../../../services/profile-data.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink } from "@angular/router";
import { User } from '../../../../interfaces/user-info';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit{
  
private readonly profileDataService = inject(ProfileDataService)

userInfo:WritableSignal<User>=signal({} as User)

  ngOnInit(): void {
    initFlowbite();

    this.getProfileInfos()
  }

      getProfileInfos(){
         this.profileDataService.getProfileData().subscribe({
          next:(res)=>{
           console.log(res);
           this.userInfo.set(res.user)
          }
         })
      }

}
