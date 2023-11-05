import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  userPosts: any = [];
  filteredPosts: any = [];
  searchTerm: string = '';
  likedPosts: string[] = []; // This will store the IDs of the liked posts

  constructor(private alertController: AlertController, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchUserPosts();
  }

  async showVideoAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Video will play soon after this functionality is implemented.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async fetchUserPosts() {
    const db = getFirestore();
    const postsCollection = collection(db, 'Posts');
    try {
      const querySnapshot = await getDocs(postsCollection);
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        postData['id'] = doc.id; // Capture the document ID
        this.userPosts.push(postData);

        // Check if the post is liked and update the likedPosts array
        if (postData['liked']) {
          this.likedPosts.push(postData['id']);
        }
      });
      this.filteredPosts = [...this.userPosts];
    } catch (error) {
      console.error('Error fetching user posts: ', error);
    }
  }

  searchPosts() {
    this.filteredPosts = this.userPosts.filter((post: { title: string }) =>
      post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async likePost(post: { id: string; }) {
    const postIndex = this.userPosts.findIndex((p: { id: string; }) => p.id === post.id);
    if (postIndex > -1) {
      this.userPosts[postIndex].liked = !this.userPosts[postIndex].liked;
      if (this.userPosts[postIndex].liked) {
        this.likedPosts.push(post.id);
      } else {
        const likedPostIndex = this.likedPosts.indexOf(post.id);
        if (likedPostIndex > -1) {
          this.likedPosts.splice(likedPostIndex, 1);
        }
      }
      this.cdRef.detectChanges(); // Trigger change detection

      // Update Firestore
      const db = getFirestore();
      const postRef = doc(db, 'Posts', post.id);
      await updateDoc(postRef, {
        liked: this.userPosts[postIndex].liked,
      });
    }
  }
}
