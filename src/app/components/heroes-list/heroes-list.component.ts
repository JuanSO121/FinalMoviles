import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Heroe } from 'src/app/interfaces/heroes.interface';
import { IonAvatar, IonItem, IonLabel, IonList, IonListHeader, IonButtons, IonIcon, IonButton, IonContent, IonHeader, IonInput, IonModal, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { create, heart, heartOutline, save, trash} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { HeroesBDService } from 'src/app/services/heroes-bd.service';

import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { OverlayEventDetail } from '@ionic/core/components';
import { FormsModule } from '@angular/forms';
import { HeroeEditComponent } from '../heroe-edit/heroe-edit.component';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss'],
  imports: [
    IonIcon,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonListHeader,
    IonAvatar,
    FormsModule,

    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonModal,
    IonTitle,
    IonToolbar,

    HeroeEditComponent


  ],
  standalone: true
})
export class HeroesListComponent  implements OnInit {

  @Input() heroes: Heroe[] = [];
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';

  @Output() heroeBorrado: EventEmitter<string> = new EventEmitter();

  unResultado: any;

  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  id!: string;

  heroe: Heroe = {
    _id: '',
    nombre: '',
    bio: '',
    img: '',
    aparicion: '',
    casa: '',
  };

  accion!: string;
  //visualizar
  //insertar
  //actualizar
  
  
  isModalOpen = false;

  constructor(
    private router: Router,
    private bd: HeroesBDService,

    private toastController: ToastController,
    private alertController: AlertController) {
    addIcons({ heart,heartOutline, trash, create, save});
   }

  ngOnInit() {}

  async verHeroe(unIdHeroe: string) {
    console.log('HEROE', unIdHeroe);
    this.id = unIdHeroe;
    this.accion = 'visualizar';

    await this.cargarUnHeroe()

    this.setOpen(true);

    //this.modal.present();
   //this.router.navigate(['/heroe', unIdHeroe, 'visualizar']);
  }

  async editarHeroe(unIdHeroe: string) {
    console.log('HEROE', unIdHeroe);
    this.id = unIdHeroe;
    this.accion = 'editar';

    await this.cargarUnHeroe()

    this.setOpen(true);

    //this.router.navigate(['/heroe', unIdHeroe, 'editar']);
  }

  crearHeroe() {
    //console.log('HEROE', unIdHeroe);

     this.id = '';
     this.accion = 'crear';

     this.heroe.nombre = ''
     this.heroe.bio = ''
     this.heroe.img = ''
     this.heroe.aparicion = ''
     this.heroe.casa = ''

     this.setOpen(true);

    //this.router.navigate(['/heroe', '', 'crear']);


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
    console.log(unHeroe);
    await this.bd.crud_Heroes(unHeroe, 'eliminar').subscribe(
      (res: any) => {
        this.unResultado = res;

        //console.log(this.unResultado);
        if (this.unResultado.Ok == true) {
          this.presentToast('top', 'Registro Eliminado...');

          this.heroeBorrado.emit(unHeroe._id);
        } else {
          console.log(this.unResultado);

          //this.presentToast('middle','Registro no pudo ser Eliminado...' + this.unResultado.msg)

          this.presentAlert('Error!', 'Eliminando Heroe', this.unResultado.msg);
        }
      },
      (error: any) => {
        console.error(error);
        this.presentAlert('Error!', 'Eliminando Heroe', 'Error Desconocido...');
        this.heroeBorrado.emit('');

      }
    );
  }

  async cargarUnHeroe() {
    await this.bd
      .getUnHeroe(this.id)
      .toPromise()
      .then((data: any) => {
        //Aqui se realiza la asignacion de los personajes de la respuesta
        this.heroe = data.resp;

        console.log("MIHeroePAGE", this.heroe);

      });
  }



  cancel() {

    //this.modal.dismiss(null, 'cancel');
    this.setOpen(false);

  }

  confirm() {
    //this.modal.dismiss(this.name, 'confirm');
    this.setOpen(false);

  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.message = `Hello, ${event.detail.data}!`;
    }

    this.id = ''
    this.accion = 'crear'

    console.log(this.id,this.accion)

  }

  async recargarHeroesModal(id: string) {

    this.confirm();
    this.heroeBorrado.emit(id);
    
    /*
    //this.cargando = true;
    await this.bdHeroes
      .getHeroes()
      .toPromise()
      .then((data: any) => {
        //Aqui se realiza la asignacion de los personajes de la respuesta
        this.heroes = data.resp;

        console.log('MISHEROES', this.heroes);

        //this.url_next = resp.info.next;
        //console.log("SIGUIENTE", this.url_next);
      });
    */  
  }  

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


}

