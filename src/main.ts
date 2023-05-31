import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  const firebaseConfig = {
    apiKey: "AIzaSyCjR_3jFx5V2YFxF9H95C--X7D0r7jsw68",
    authDomain: "telemetriasolares-trainee.firebaseapp.com",
    projectId: "telemetriasolares-trainee",
    storageBucket: "telemetriasolares-trainee.appspot.com",
    messagingSenderId: "584561323819",
    appId: "1:584561323819:web:5af4ed20cb6a265f009f6e"
  };
  const app = initializeApp(firebaseConfig);
