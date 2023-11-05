import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getAuth, updateEmail, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  profileData = {
    username: '',
    firstName: '',
    lastName: '',
    email: '', // Add email field
    profilePicture: ''
  };

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.fetchProfileData();
  }

  async fetchProfileData() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        this.profileData = userDoc.data() as any;
        // Set the email field to the user's current email
        this.profileData.email = user.email || '';
      }
    }
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileData.profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveProfile() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDoc = doc(db, 'Users', user.uid);
      await setDoc(userDoc, this.profileData, { merge: true });

      // Update the email address
      if (this.profileData.email !== user.email) {
        try {
          await updateEmail(user, this.profileData.email);
        } catch (error: any) {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Email update failed: ' + error.message,
            buttons: ['OK']
          });
          await alert.present();
          return;
        }
      }

      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Profile saved successfully.',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'User not authenticated.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
