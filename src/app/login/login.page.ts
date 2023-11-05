import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.router.navigate(['/tabs/tab1']);
      }
    });
  }

  async loginUser() {
    if (this.email && this.password) {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, this.email, this.password);

        this.presentAlert('Success', 'Logged in successfully.');
        this.router.navigate(['/tabs/tab1']); // Redirect to the home page or any desired page.
      } catch (error: any) {
        this.presentAlert('Error', error.message);
      }
    } else {
      this.presentAlert('Error', 'Please enter both email and password.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async resetPassword() {
    if (this.email) {
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, this.email);

        this.presentAlert('Password Reset Email Sent', 'Check your email to reset your password.');
      } catch (error: any) {
        this.presentAlert('Error', error.message);
      }
    } else {
      this.presentAlert('Error', 'Please enter your email to reset your password.');
    }
  }
}
