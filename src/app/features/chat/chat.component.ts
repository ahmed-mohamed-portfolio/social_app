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
import { ElementRef, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Subscription, finalize } from 'rxjs';
import { CheckStatusService } from './services/check-status.service';
import { SocketService } from '../../core/socket/socket.service';


@Component({
  selector: 'app-chat',
  imports: [NavbarComponent, DatePipe, RouterLink, InfiniteScrollDirective],
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

  pageNumber: WritableSignal<number> = signal(1);
  newMessages: WritableSignal<Message[]> = signal([])
  pages: WritableSignal<number> = signal(0);

  subscribe: Subscription = new Subscription();
  isLoading = signal(false);
  size = signal(10)
  totalMessages = signal(0);

  private checkStatusService: CheckStatusService = inject(CheckStatusService)
  userStatuses = signal<Record<string, boolean>>({});
  private readonly socketService = inject(SocketService);



  ngOnInit(): void {

    initFlowbite();

    this.listenToSuccessMessage()

    this.listenToNewMessage()

    this.listenToUserStatuses();

    //i have problem : when i refresh the page the connection in backend dont complete 
    // and the  this.usersInChat() dont work , so i search about way to , dont open the compunent till comblete the connection socket with backend
    //i can solve it for now by using settimeout
    setTimeout(() => {
      this.usersInChat()
    }, 1000);

    console.log("userStatuses", this.userStatuses());

  }

  //   ==========  online or offline features  ==============
  listenToUserStatuses() {

    // Response to initial status requests
    this.checkStatusService.onlineOrOffline()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ userId, isOnline }) => {

          this.updateUserStatus(userId, isOnline);
        }
      });

    // User connected
    this.checkStatusService.onlineUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ userId }) => {
          this.updateUserStatus(userId, true);
        }
      });

    // User disconnected
    this.checkStatusService.offlineUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ userId }) => {
          this.updateUserStatus(userId, false);
        }
      });
  }

  updateUserStatus(userId: string, isOnline: boolean) {
    this.userStatuses.update(statuses => ({
      ...statuses,
      [userId]: isOnline
    }));
  }
  //==============================================================

  usersInChat() {

    //on
    this.getUsersInChatService.getUsersInChat().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (users) => {

        this.users.set(users);

        console.log('Users in chat:', users);

        // Check the current status of each user 
        // online or offline features
        users.forEach(user => {
          this.checkStatusService.checkStatus(user._id);
        });

      },
      error: (error) => {
        console.error(error);
      }
    });

    //emit
    this.getUsersInChatService.requestUsersInChat();

  }

  openChat(id: string) {
    this.subscribe.unsubscribe();
    this.pageNumber.set(1);
    this.pages.set(0);
    this.messages.set([]);
    this.newMessages.set([]);
    this.participants.set([]);
    this.totalMessages.set(0)
    this.GetOneChat(id);
  }

  GetOneChat(id: string) {


    if (this.isLoading()) return;
    this.isLoading.set(true);


    const container = this.messagesContainer()?.nativeElement;
    const oldScrollHeight = container?.scrollHeight ?? 0;
    const oldScrollTop = container?.scrollTop ?? 0;



    this.subscribe = this.getOneChatService.getOneChat(id, this.pageNumber(), this.size())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {

          console.log("GetOneChatres", res);



          //message section appear if  sectionHiddenOrView == true
          this.sectionHiddenOrView.set(true)


          this.pages.set(res.data.chat.pages);
          this.totalMessages.set(res.data.chat.totalMessages);
          const isLastPage = this.pageNumber() === this.pages();
          const remaining = this.totalMessages() % this.size();

          this.newMessages.set(
            isLastPage && remaining > 0
              ? res.data.chat.messages.slice(0, remaining) // when i have for example 24 message and 10 messages per page the database will return in last page (4 new+6 old) , i do that to reject 6 old
              : res.data.chat.messages
          );

          this.messages.update(messages => [
            ...this.newMessages(),
            ...messages
          ]);


          this.participants.set(res.data.chat.participants)


          if (this.pageNumber() === 1) {
            this.autoScrollDown('ToFirstMessage');
          } else {
            this.autoScrollDown('ToFixedPoint', oldScrollHeight, oldScrollTop);
          }


          //if participants()[0] not the logged user change participants()[0] to be participants()[1]
          const currentUserId = localStorage.getItem('id');
          if (this.participants()[0]?.id !== currentUserId) {
            this.participants.set([...this.participants()].reverse());
          }


        }, error: (err) => {
          console.log("error", err);

          if (this.pageNumber() > 1) {
            this.pageNumber.update(v => v - 1);
          }
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
        this.messages.update((messages) => [...messages, message]);

        this.autoScrollDown("ToFirstMessage")

      }, error: (err) => {
        console.log(err);

      }
    })

  }

  //on NEW_MESSAGE
  listenToNewMessage() {
    this.sendMessageService.newMessage().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (message) => {
        this.messages.update((messages) => [...messages, message.message]);

        this.autoScrollDown('ToFirstMessage')

      }, error: (err) => {
        console.log(err);

      }
    })

  }

  autoScrollDown(
    where: string,
    oldScrollHeight = 0,
    oldScrollTop = 0
  ) {
    setTimeout(() => {
      const container = this.messagesContainer()?.nativeElement;

      if (!container) return;

      if (where === 'ToFirstMessage') {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }

      else if (where === 'ToFixedPoint') {
        const newScrollHeight = container.scrollHeight;

        container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);

        /*
            Preserve the user's scroll position when older messages are added above.
     
            Example:
            oldScrollTop    = 50px
            oldScrollHeight = 669px
            newScrollHeight = 1294px
     
            New scroll position = 50 + (1294 - 669) = 675px
           */

      }
    }, 0);
  }

  onScrollUp() {

    if (this.isLoading()) return;

    if (this.pageNumber() >= this.pages()) return;

    this.pageNumber.update(v => v + 1);
    this.GetOneChat(this.participants()[1]._id);

  }

}
