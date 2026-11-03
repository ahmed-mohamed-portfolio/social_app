
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SocketEvents } from './socket-events';

@Injectable({
    providedIn: 'root'
})

export class SocketService {

    private readonly cookieService = inject(CookieService);

    private readonly socket: Socket = io(environment.baseUrl, {
        autoConnect: false,
        withCredentials: true,
        reconnection: true,

        auth: (callback) => {
            callback({
                authorization: this.cookieService.get('accessToken')
            });
        }
    });

    constructor() {

        this.socket.on(SocketEvents.CONNECT, () => {
            console.log('Socket connected:', this.socket.id);
        });

        this.socket.on(SocketEvents.CONNECT_ERROR, (error) => {
            console.error('Socket error:', error.message);
        });

        this.socket.on(SocketEvents.DISCONNECT, (reason) => {
            console.log('Socket disconnected:', reason);
        });
    }

    connect(): void {

        // const token = this.cookieService.get('accessToken');

        // if (!token) {
        //     console.warn('Access Token not found');
        //     return;
        // }

        // this.socket.auth = {
        //     authorization: token
        // };

        if (!this.socket.connected) {
            this.socket.connect();

            console.log("connected");

        }
    }


    emit<T>(event: string, data?: T): void {
        console.log("Emitting:", event);
        console.log("Connected:", this.socket.connected);
        console.log("Socket ID:", this.socket.id);

        this.socket.emit(event, data);
    }

    on<T>(event: string): Observable<T> {

        return new Observable<T>((observer) => {

            const listener = (data: T) => {
                observer.next(data);
            };

            this.socket.on(event, listener);

            return () => {
                this.socket.off(event, listener);
            };
        });
    }

    isConnected(): boolean {
        return this.socket.connected;
    }

    disconnect(): void {
        this.socket.disconnect();
    }

}
