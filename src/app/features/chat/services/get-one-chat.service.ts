import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessages } from '../models/chat-messages';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GetOneChatService {

  private http = inject(HttpClient)

  getOneChat(id: string): Observable<ChatMessages> {
    return this.http.get<ChatMessages>(environment.baseUrl + `/chat/${id}?page=1&size=10`)
  }

}
