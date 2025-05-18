import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { Heroe } from '../../interfaces/heroes.interface';
import { HeroesBDService } from '../../services/heroes-bd.service';
import { HeroesListComponent } from '../../components/heroes-list/heroes-list.component';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.page.html',
  styleUrls: ['./heroes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    HeroesListComponent
  ]
})
export class HeroesPage implements OnInit {
  heroes: Heroe[] = [];
  isLoading = false;

  constructor(
    private heroesBDService: HeroesBDService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadHeroes();
  }

  async loadHeroes() {
    try {
      this.isLoading = true;
      const data: any = await this.heroesBDService.getHeroes().toPromise();
      
      if (data && data.resp) {
        this.heroes = data.resp;
        console.log('Heroes cargados:', this.heroes);
      } else {
        throw new Error('No se recibieron datos válidos del servidor');
      }
    } catch (error) {
      console.error('Error al cargar héroes:', error);
      this.presentToast('No se pudieron cargar los héroes. Intente nuevamente.', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async recargarHeroes(event?: any) {
    try {
      const data: any = await this.heroesBDService.getHeroes().toPromise();
      
      if (data && data.resp) {
        this.heroes = data.resp;
        this.presentToast('Lista de héroes actualizada', 'success');
      } else {
        throw new Error('No se recibieron datos válidos del servidor');
      }
    } catch (error) {
      console.error('Error al recargar héroes:', error);
      this.presentToast('Error al actualizar la lista de héroes', 'danger');
    } finally {
      // Si existe event, es porque viene del ion-refresher
      if (event) {
        event.target.complete();
      }
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}