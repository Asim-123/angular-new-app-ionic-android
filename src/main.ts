import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { initializeApp } from 'firebase/app';

enableProdMode();

const firebaseConfig = {
  apiKey: "AIzaSyCzX9_aa9upBgc_V5pw_V6Dk5qiMekE8Fg",
  authDomain: "ionic-news-app-9fe5e.firebaseapp.com",
  projectId: "ionic-news-app-9fe5e",
  storageBucket: "ionic-news-app-9fe5e.appspot.com",
  messagingSenderId: "282495113252",
  appId: "1:282495113252:web:53ad5e636c9b6711a320b1"
};

const app = initializeApp(firebaseConfig); // Initialize Firebase using the direct configuration

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
