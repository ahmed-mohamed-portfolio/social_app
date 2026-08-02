import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, Messaging, onMessage } from 'firebase/messaging';
import { firebaseConfig, firebaseVapidKey } from './../../firebase-config';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  private messaging?: Messaging;
  private serviceWorkerRegistration?: ServiceWorkerRegistration;

  constructor(private http: HttpClient) { }

  async requestToken(): Promise<string> {
    await this.ensureMessagingIsReady();

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('Permission denied');
    }

    return getToken(this.messaging!, {
      vapidKey: firebaseVapidKey,
      serviceWorkerRegistration: this.serviceWorkerRegistration,
    });
  }

  async listenForForegroundMessages(): Promise<void> {
    await this.ensureMessagingIsReady();

    onMessage(this.messaging!, (payload) => {
      console.log('Foreground message:', payload);

      if (Notification.permission === 'granted') {
        new Notification(payload.data?.['title'] || 'New Notification', {
          body: payload.data?.['body'] || 'You have a message',
          icon: '/favicon.ico',
        });
      }
    });
  }

  private async ensureMessagingIsReady(): Promise<void> {
    if (this.messaging) {
      return;
    }

    if (!('Notification' in window)) {
      throw new Error('Notifications are not supported in this browser');
    }

    if (!(await isSupported())) {
      throw new Error('Firebase messaging is not supported in this browser');
    }

    const app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(app);
    this.serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  }
}
