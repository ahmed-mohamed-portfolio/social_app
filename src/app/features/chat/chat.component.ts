import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { GetUsersInChatService } from './services/get-users-in-chat.service';
import { IChatUser } from './models/ichat-user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavbarComponent } from '../../core/layouts/main-layout/components/navbar/navbar.component';
import { GetOneChatService } from './services/get-one-chat.service';
import { Message, Participant } from './models/chat-messages';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SendMessageService } from './services/send-message.service';
import { ElementRef, viewChild, afterRenderEffect } from '@angular/core';
import { environment } from '../../../environments/environment.development';



@Component({
  selector: 'app-chat',
  imports: [NavbarComponent, DatePipe, RouterLink,],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  private readonly getUsersInChatService = inject(GetUsersInChatService)
  private readonly destroyRef = inject(DestroyRef);
  readonly users = signal<IChatUser[]>([]);
  backendUrlStatic: string = `${environment.baseUrl}/uploads/`
  private getOneChatService = inject(GetOneChatService)

  protected messages: WritableSignal<Message[]> = signal([])
  protected participants: WritableSignal<Participant[]> = signal([])

  protected sectionHiddenOrView: WritableSignal<boolean> = signal(false)
  isNotMobile = signal(window.innerWidth > 768);

  sendMessageService = inject(SendMessageService)
  messagesContainer = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');



  constructor() {

    afterRenderEffect(() => {
      this.messages(); // afterRenderEffect work when any signal depend on it change

      const container = this.messagesContainer()?.nativeElement;

      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }


  ngOnInit(): void {
    initFlowbite();

    this.usersInChat()
    this.listenToSuccessMessage()
    this.listenToNewMessage()

  }

  usersInChat() {

    //emit
    this.getUsersInChatService.requestUsersInChat();

    //on
    this.getUsersInChatService.getUsersInChat().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (users) => {

        this.users.set(users);

        console.log('Users in chat:', users);

      },
      error: (error) => {
        console.error(error);
      }
    });


  }


  GetOneChat(id: string) {
    this.getOneChatService.getOneChat(id).subscribe({
      next: (res) => {
        console.log(res);

        this.messages.set(res.data.chat.messages)
        this.participants.set(res.data.chat.participants)
        console.log("this.participants", this.participants());

        const currentUserId = localStorage.getItem('id');
        if (this.participants()[0]?.id !== currentUserId) {
          this.participants.set([...this.participants()].reverse());
        }


        this.sectionHiddenOrView.set(true)

      }, error: (err) => {
        console.log("error", err);

      }
    })
  }


  sectionHiddenOrViewInverse() {
    this.sectionHiddenOrView.update(v => !v)
  }



  sendMessages(content: string, sendTo: string, input: HTMLInputElement) {

    if (content.length === 0) return;
    //emit
    this.sendMessageService.sendMessage({ content, sendTo })

    // Clear input
    input.value = '';

  }


  //on SUCCESS_MESSAGE
  listenToSuccessMessage() {
    this.sendMessageService.successMessage().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (message) => {
        console.log("message", message);
        this.messages.update((messages) => [...messages, message]);

        console.log("messagesmessages", this.messages());

      }, error: (err) => {
        console.log(err);

      }
    })

  }






  //on NEW_MESSAGE
  listenToNewMessage() {
    this.sendMessageService.newMessage().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (message) => {
        console.log("newwwwwmessage",);
        this.messages.update((messages) => [...messages, message.message]);

        console.log("messagesmessages", this.messages());

      }, error: (err) => {
        console.log(err);

      }
    })

  }


}
