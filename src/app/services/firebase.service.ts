import { Injectable } from '@angular/core';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firebaseConfig = {
    apiKey: 'AIzaSyCjR_3jFx5V2YFxF9H95C--X7D0r7jsw68',
    authDomain: 'telemetriasolares-trainee.firebaseapp.com',
    projectId: 'telemetriasolares-trainee',
    storageBucket: 'telemetriasolares-trainee.appspot.com',
    messagingSenderId: '584561323819',
    appId: '1:584561323819:web:5af4ed20cb6a265f009f6e',
  };
  private firebaseApp: firebase.app.App;
  private ui: firebaseui.auth.AuthUI;

  constructor(private router: Router) {
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp(this.firebaseConfig);
    }

    this.ui = new firebaseui.auth.AuthUI(this.getAuth());

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['../']);
      } else {
        localStorage.removeItem('profile')
        this.router.navigate(['/login']);
      }
    });
  }

  getAuth() {
    return this.firebaseApp.auth();
  }

  getAuthUI() {
    return this.ui;
  }

  getGoogleProvider() {
    return firebase.auth.GoogleAuthProvider.PROVIDER_ID;
  }

  signOut() {
    this.getAuth().signOut();
  }
}
