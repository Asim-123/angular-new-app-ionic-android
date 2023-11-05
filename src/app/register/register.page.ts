import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  profileData: any = {}; // Define the profileData object to hold user data

  private auth: any;
  private db: any;

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {
    this.auth = getAuth();
    this.db = getFirestore();
  }

  async registerUser() {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      const userDocRef = doc(this.db, 'Users', user.uid);
      const userData = {
        username: this.profileData.username,
        firstName: this.profileData.firstName,
        lastName: this.profileData.lastName,
      };

      await setDoc(userDocRef, userData);

      this.presentAlert('Success', 'Registration successful.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.presentAlert('Error', error.message);
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
