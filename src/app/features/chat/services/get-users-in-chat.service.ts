import { environment } from './../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from '../../../core/socket/socket.service';
import { IChatUser } from '../models/ichat-user';
import { SocketEvents } from '../../../core/socket/socket-events';

@Injectable({
  providedIn: 'root'
})
export class GetUsersInChatService {


  private readonly socketService = inject(SocketService);

  getUsersInChat(): Observable<IChatUser[]> {

    return this.socketService.on<IChatUser[]>(
      SocketEvents.USERS_IN_CHAT
    );

  }



  requestUsersInChat(): void {

    this.socketService.emit(
      SocketEvents.GET_USERS_IN_CHAT
    );
  }

}
