import { inject, Injectable } from '@angular/core';
import { SocketEvents } from '../../../core/socket/socket-events';
import { SocketService } from '../../../core/socket/socket.service';
import { Observable } from 'rxjs';
import { OnlineOrOfline } from '../models/online-or-ofline';

@Injectable({
  providedIn: 'root'
})
export class CheckStatusService {

  private readonly socketService = inject(SocketService);

  checkStatus(userId: string): void {
    this.socketService.emit(SocketEvents.CHECK_STATUS, userId);
  }

  onlineOrOffline(): Observable<OnlineOrOfline> {
    return this.socketService.on<OnlineOrOfline>(
      SocketEvents.ONLINE_OR_OFFLINE
    );
  }

  onlineUser(): Observable<{ userId: string }> {
    return this.socketService.on<{ userId: string }>(
      SocketEvents.ONLINE_USER
    );
  }

  offlineUser(): Observable<{ userId: string }> {
    return this.socketService.on<{ userId: string }>(
      SocketEvents.OFFLINE_USER
    );
  }




}
