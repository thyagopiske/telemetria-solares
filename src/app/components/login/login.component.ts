import { Component, OnInit } from '@angular/core';

import { initializeApp } from 'firebase/app';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  teste: boolean = true
  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const emailsPermitidos = [
      'thyagopiske@gmail.com',
      'daviagatti@gmail.com',
      'guiefgen@gmail.com',
      'fernandorr1108@gmail.com'
    ];

    this.firebaseService.getAuthUI().start('#firebaseui-auth-container', {
      signInFlow: 'popup',
      signInOptions: [this.firebaseService.getGoogleProvider()],
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          if (
            emailsPermitidos.filter(
              (x) => x == authResult.additionalUserInfo.profile.email
            )?.length === 0
          ) {
            this.snackBar.open('Você não está autorizado a logar', 'X', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.firebaseService.signOut();
            this.router.navigate(['/login']);
            return false;
          }
          // localStorage.setItem('profile', authResult.additionalUserInfo.profile)

          // this.router.navigate(['']);
          return false;
        },
        signInFailure: (error) => {
          this.snackBar.open(
            'Não possível entrar com sua conta do google',
            'X',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        },
      },
    });
  }

  teste2(){
    this.teste=false
  }
}
