importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAynhGemyVcjJkv7H1RGVkvxvZiu5z4LGM',
  authDomain: 'sendtestnotification-ee4ea.firebaseapp.com',
  projectId: 'sendtestnotification-ee4ea',
  storageBucket: 'sendtestnotification-ee4ea.firebasestorage.app',
  messagingSenderId: '196434121562',
  appId: '1:196434121562:web:e5c32c4af77f94b2475963',
  measurementId: 'G-W6EQKRJ4J7',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw] Background message:', payload);

  self.registration.showNotification(payload.data?.title || 'New Notification', {
    body: payload.data?.body || 'You have a message',
    icon: '/favicon.ico',
  });
});
