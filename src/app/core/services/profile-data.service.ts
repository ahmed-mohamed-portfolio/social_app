import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment.development'
import { UserInfo } from '../interfaces/user-info';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {
  private readonly http = inject(HttpClient)

  getProfileData():Observable<UserInfo>{
     return this.http.get<UserInfo>(environment.baseUrl + 'users/profile-data')
  }

}
