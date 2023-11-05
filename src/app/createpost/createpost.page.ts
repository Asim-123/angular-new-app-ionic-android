import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.page.html',
  styleUrls: ['./createpost.page.scss'],
})
export class CreatepostPage {
  title: string = '';
  content: string = '';
  heading: string = '';
  tags: string = '';
  category: string = '';
  videoLink: string = '';
  selectedImage: File | null = null; // Store the selected image file

  constructor(private alertController: AlertController) {}

  async createPost() {
    const user = getAuth().currentUser;

    if (user) {
      const userId = user.uid;
      const postData = {
        title: this.title,
        content: this.content,
        heading: this.heading,
        tags: this.tags,
        category: this.category,
        videoLink: this.videoLink,
        userId: userId,
        imageDownloadURL: ''  // initialize with empty string
      };

      const db = getFirestore();

      try {
        // Add the post to the "Posts" collection
        const docRef = await addDoc(collection(db, 'Posts'), postData);

        if (this.selectedImage) {
          // Upload the selected image to Firebase Storage
          const storage = getStorage();
          const storageRef = ref(storage, `post_images/${userId}/${docRef.id}_${this.selectedImage.name}`);
          await uploadBytes(storageRef, this.selectedImage);

          // Get the download URL for the uploaded image
          const imageUrl = await getDownloadURL(storageRef);

          // Update the post with the image URL
          await updateDoc(doc(db, 'Posts', docRef.id), { imageDownloadURL: imageUrl });

          console.log('Image URL:', imageUrl);
        }

        // Reset form fields and show a success message
        this.title = '';
        this.content = '';
        this.heading = '';
        this.tags = '';
        this.category = '';
        this.videoLink = '';
        this.selectedImage = null;

        this.presentAlert('Success', 'Post created successfully.');
      } catch (error) {
        console.error('Error adding or updating document: ', error);
      }
    } else {
      console.log('User not authenticated');
    }
  }

  // Function to handle file input
  handleFileInput(event: any) {
    this.selectedImage = event.target.files[0];
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
