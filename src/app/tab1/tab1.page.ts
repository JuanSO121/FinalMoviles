import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonText } from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { HeroesBDService } from '../services/heroes-bd.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonText, IonButton, IonLabel, IonItem, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, CommonModule],
})
export class Tab1Page {

  user: string = '';
  password: string = '';
  err: string ='';

  constructor(private storageService: StorageService, private dbService: HeroesBDService) {}

  async loadCookie() {
  this.dbService.login(this.user, this.password).subscribe({
    next: (res: any) => {
      if (res.ok) {
        console.log('entro a ok')
        this.storageService.setCookie(res.token);
        console.log(this.storageService.getCookie())
      } else {
        this.err = res.msg;
      }
    },
    error: (err) => {
      console.error('Error en login:', err);
      if (err.error && err.error.msg) {
        this.err = err.error.msg; // <- Aquí accedes al JSON del backend
      } else {
        this.err = 'Error desconocido. Intenta de nuevo.';
      }
    }
  });
}
}
