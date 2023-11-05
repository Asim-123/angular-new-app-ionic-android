import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-capacitor-camera',
  templateUrl: './capacitor-camera.page.html',
  styleUrls: ['./capacitor-camera.page.scss'],
})
export class CapacitorCameraPage implements OnInit {
  imageSrc: string | undefined; 

  constructor() { }

  async ngOnInit() {

  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
      });

      const imageUrl = image.webPath;

      this.imageSrc = imageUrl;
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }
}
