import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyA_tGXxpsUy5VOV_tZTH9qfoAnK6LzdRQ0",
  authDomain: "datablue-b0cc8.firebaseapp.com",
  projectId: "datablue-b0cc8",
  storageBucket: "datablue-b0cc8.appspot.com",
  messagingSenderId: "193822069592",
  appId: "1:193822069592:web:31b9570a3cdd762f29cb2d",
  measurementId: "G-1E40KL5Z8F"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())  // ⬅️ ¡ESTO ES CLAVE!
  ]
});
