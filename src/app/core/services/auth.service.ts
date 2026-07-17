import { inject, Injectable, REQUEST } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { NewToken } from '../interfaces/new-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  checkAuth(): Observable<{ auth: boolean }> {


    const request = inject(REQUEST, { optional: true }) as Request | null;
    const cookieHeader = request?.headers.get('cookie') ?? '';


    return this.http.get<{ auth: boolean }>(environment.baseUrl + '/get-cookie', {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      withCredentials: true,
    });


  }




  generateAccessTokenByRefreshToken(): Observable<NewToken> {


    return this.http.get<NewToken>(environment.baseUrl + '/users/generate-access-token');

  }
}
