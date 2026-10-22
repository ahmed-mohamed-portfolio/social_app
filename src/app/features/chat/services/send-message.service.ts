import { inject, Injectable } from '@angular/core';
import { SocketService } from '../../../core/socket/socket.service';
import { SocketEvents } from '../../../core/socket/socket-events';
import { Observable } from 'rxjs';
import { NewMessage } from '../models/new-message';
import { SuccessMessage } from '../models/success-message';

@Injectable({
  providedIn: 'root'
})
export class SendMessageService {

  private readonly socketService = inject(SocketService);

  sendMessage(data: { content: string, sendTo: string }) {
    return this.socketService.emit(SocketEvents.SEND_MESSAGE, data)
  }

  successMessage(): Observable<SuccessMessage> {
    return this.socketService.on<SuccessMessage>(SocketEvents.SUCCESS_MESSAGE)
  }

  newMessage(): Observable<NewMessage> {
    return this.socketService.on<NewMessage>(SocketEvents.NEW_MESSAGE)
  }
}
