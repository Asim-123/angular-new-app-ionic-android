import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {
  email: string = '';
  currentPassword: string = '';
  newPassword: string = '';

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  async resetPassword() {
    if (this.email && this.currentPassword && this.newPassword) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const credential = EmailAuthProvider.credential(this.email, this.currentPassword);
        try {
          // Re-authenticate user
          await reauthenticateWithCredential(user, credential);

          // Update password
          await updatePassword(user, this.newPassword);
          this.presentAlert('Success', 'Password changed successfully.');
        } catch (error: any) {
          this.presentAlert('Error', error.message);
        }
      } else {
        this.presentAlert('Error', 'User is not logged in.');
      }
    } else {
      this.presentAlert('Error', 'Please fill out all fields.');
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
}
