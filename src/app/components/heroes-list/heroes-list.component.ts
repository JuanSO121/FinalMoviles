import { Component, EventEmitter, Input, OnInit, Output, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Heroe } from 'src/app/interfaces/heroes.interface';
import { IonAvatar, IonItem, IonLabel, IonList, IonListHeader, IonButtons, IonIcon, IonButton, IonContent, IonHeader, IonInput, IonModal, IonTitle, IonToolbar, IonCard, IonAlert, IonFab, IonFabButton, IonSpinner } from "@ionic/angular/standalone";
import { create, heart, heartOutline, save, trash, add, createOutline, trashOutline, sadOutline, closeOutline, alertCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { HeroesBDService } from 'src/app/services/heroes-bd.service';

import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { OverlayEventDetail } from '@ionic/core/components';
import { FormsModule } from '@angular/forms';
import { HeroeEditComponent } from '../heroe-edit/heroe-edit.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss'],
  imports: [
    CommonModule,
    IonFabButton, 
    IonFab, 
    IonAlert, 
    IonCard, 
    IonIcon,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonListHeader,
    IonAvatar,
    FormsModule,
    IonContent,
    IonHeader,
    IonItem,
    IonInput,
    IonModal,
    IonTitle,
    IonToolbar,
    IonSpinner,
    HeroeEditComponent
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroesListComponent implements OnInit {

  @Input() heroes: Heroe[] = [];
  @Input() titulo: string = 'Héroes';
  @Input() subtitulo: string = 'Listado de superhéroes';

  @Output() heroeBorrado: EventEmitter<string> = new EventEmitter();
  @Output() heroeActualizado: EventEmitter<void> = new EventEmitter();

  unResultado: any;
  isLoading: boolean = false;
  errorMessage: string = '';

  @ViewChild(IonModal) modal!: IonModal;

  id: string = '';

  heroe: Heroe = {
    nombre: '',
    bio: '',
    img: [], // Initialized as an empty array
    aparicion: '',
    casa: '',
  };

  accion: string = 'crear';
  showDeleteConfirm: boolean = false;
  heroeAEliminar: Heroe | null = null;
  isModalOpen = false;

  constructor(
    private router: Router,
    private bd: HeroesBDService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({alertCircleOutline,add,createOutline,trashOutline,sadOutline,closeOutline,heart,heartOutline,trash,create,save});
  }

  ngOnInit() {
    // Load heroes if none are provided via @Input
    if (this.heroes.length === 0) {
      this.loadHeroes();
    }
  }

  async loadHeroes() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      const data: any = await this.bd.getHeroes().toPromise();
      if (data && data.resp) {
        this.heroes = data.resp;
      } else {
        throw new Error('No se recibieron datos válidos');
      }
    } catch (error) {
      console.error('Error loading heroes:', error);
      this.errorMessage = 'Error al cargar los héroes';
      this.presentAlert('Error', 'Error al cargar héroes', 'No se pudieron cargar los héroes. Inténtalo de nuevo más tarde.');
    } finally {
      this.isLoading = false;
    }
  }

  // Helper method to get the first image from the hero
  getHeroMainImage(hero: Heroe): string {
    if (Array.isArray(hero.img) && hero.img.length > 0) {
      return hero.img[0];
    } else if (typeof hero.img === 'string' && hero.img) {
      return hero.img;
    }
    return 'assets/placeholder-hero.jpg';
  }

  async verHeroe(unIdHeroe: string | undefined) {
    if (!unIdHeroe) return;
    
    console.log('HEROE', unIdHeroe);
    this.id = unIdHeroe;
    this.accion = 'visualizar';

    await this.cargarUnHeroe();
    this.setOpen(true);
  }

  async editarHeroe(unIdHeroe: string | undefined) {
    if (!unIdHeroe) return;
    
    console.log('HEROE', unIdHeroe);
    this.id = unIdHeroe;
    this.accion = 'editar';

    await this.cargarUnHeroe();
    this.setOpen(true);
  }

  crearHeroe() {
    this.id = '';
    this.accion = 'crear';

    this.heroe = {
      nombre: '',
      bio: '',
      img: [], // Initialize as empty array
      aparicion: '',
      casa: ''
    };

    this.setOpen(true);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  async presentAlert(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['Ok'],
    });

    await alert.present();
  }

  async eliminarHeroe(unHeroe: Heroe) {
    try {
      if (!unHeroe._id) {
        this.presentAlert('Error!', 'Eliminando Héroe', 'No se puede eliminar un héroe sin ID');
        return;
      }
      
      console.log('Eliminando héroe:', unHeroe);
      const res: any = await this.bd.crud_Heroes(unHeroe, 'eliminar').toPromise();
      
      if (res && res.Ok === true) {
        this.presentToast('top', 'Héroe eliminado correctamente');
        this.showDeleteConfirm = false;
        this.heroeBorrado.emit(unHeroe._id);
        
        // Refresh heroes list
        await this.loadHeroes();
      } else {
        console.error('Error al eliminar:', res);
        this.presentAlert('Error!', 'Eliminando Héroe', res?.msg || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error eliminar héroe:', error);
      this.presentAlert('Error!', 'Eliminando Héroe', 'Error Desconocido...');
    }
  }

  async cargarUnHeroe() {
    try {
      if (!this.id) {
        throw new Error('ID no válido');
      }
      
      const data: any = await this.bd.getUnHeroe(this.id).toPromise();
      if (data && data.resp) {
        this.heroe = data.resp;
        
        // Ensure img is always an array
        if (typeof this.heroe.img === 'string') {
          this.heroe.img = [this.heroe.img];
        } else if (!Array.isArray(this.heroe.img)) {
          this.heroe.img = [];
        }
        
        console.log("MIHeroePAGE", this.heroe);
      } else {
        throw new Error('No se pudo cargar el héroe');
      }
    } catch (error) {
      console.error('Error al cargar héroe:', error);
      this.presentAlert('Error', 'Cargando Héroe', 'No se pudo cargar la información del héroe.');
    }
  }

  cancel() {
    this.setOpen(false);
  }

  confirm() {
    this.setOpen(false);
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      // Handle modal confirmation
      this.loadHeroes(); // Refresh heroes after confirmation
    }

    this.id = '';
    this.accion = 'crear';
  }

  mostrarConfirmacionEliminar(heroe: Heroe) {
    if (!heroe) return;
    
    this.heroeAEliminar = heroe;
    this.showDeleteConfirm = true;
    
    // Use AlertController instead of ion-alert component
    this.mostrarAlertaConfirmacion(heroe);
  }
  
  async mostrarAlertaConfirmacion(heroe: Heroe) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar a ${heroe.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.showDeleteConfirm = false;
          },
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.eliminarHeroe(heroe);
          },
        },
      ],
    });

    await alert.present();
  }

  async recargarHeroesModal(id: string) {
    this.confirm();
    this.heroeBorrado.emit(id);
    await this.loadHeroes(); // Refresh heroes list after changes
    this.heroeActualizado.emit(); // Emit event to parent component
  }  

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}