import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { getAuth, signOut } from 'firebase/auth';
import { Auth, sendPasswordResetEmail } from 'firebase/auth';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(private router: Router, private alertController: AlertController) {}

  navigateTo(routePath: string) {
    this.router.navigateByUrl(routePath);
  }

  async resetPassword() {
    const auth = getAuth();
    const email = auth.currentUser?.email; // Get the current user's email

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        this.presentAlert('Password Reset Email Sent', 'Please check your email for instructions on how to reset your password.');
      } catch (error: any) {
        this.presentAlert('Error', error.message);
      }
    } else {
      this.presentAlert('Error', 'No user is currently authenticated.');
    }
  }

  async logout() {
    const auth = getAuth();
    try {
      await signOut(auth);
      this.router.navigate(['/login']); // Redirect to the login page after logout
    } catch (error: any) {
      this.presentAlert('Error', error.message);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}