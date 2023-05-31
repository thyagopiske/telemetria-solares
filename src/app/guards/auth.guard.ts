import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  firebaseConfig = {
    apiKey: 'AIzaSyCjR_3jFx5V2YFxF9H95C--X7D0r7jsw68',
    authDomain: 'telemetriasolares-trainee.firebaseapp.com',
    projectId: 'telemetriasolares-trainee',
    storageBucket: 'telemetriasolares-trainee.appspot.com',
    messagingSenderId: '584561323819',
    appId: '1:584561323819:web:5af4ed20cb6a265f009f6e',
  };

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,

    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // const isAuthenticated = !!this.firebaseService.getAuth().currentUser;
    const isAuthenticated = !!localStorage.getItem('user')
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
