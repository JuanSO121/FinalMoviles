import { Component, OnInit } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonImg,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSpinner,
  IonThumbnail,
  IonActionSheet,
  ActionSheetController,
  AlertController,
  ToastController,
  LoadingController, IonCardSubtitle, IonCardTitle, IonSearchbar } from '@ionic/angular/standalone';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroesBDService } from '../services/heroes-bd.service';
import { Heroe } from '../interfaces/heroes.interface';
import { addCircleOutline, trashOutline, imageOutline, closeCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonCardTitle, IonCardSubtitle, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonImg,
    IonIcon,
    IonFab,
    IonFabButton,
    IonSpinner,
    IonThumbnail,
    NgFor,
    NgIf,
    FormsModule
  ],
})
export class Tab3Page implements OnInit {
  // Lista de héroes
  heroes: Heroe[] = [];
  // Héroe seleccionado actualmente
  selectedHero: Heroe | null = null;
  // Lista de imágenes del héroe seleccionado
  heroImages: string[] = [];
  // Nueva URL de imagen para agregar
  newImageUrl: string = '';
  // Estado de carga
  loading: boolean = false;
  // Mensaje de error
  errorMessage: string = '';

  constructor(
    private heroeService: HeroesBDService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    // Agregar iconos
    addIcons({closeCircleOutline,addCircleOutline,imageOutline,trashOutline});
  }

  ngOnInit() {
    this.loadHeroes();
  }

  /**
   * Imprime la estructura del objeto para depuración
   */
  private debugObject(obj: any, label: string = 'Objeto'): void {
    console.log(`${label}:`, obj);
    console.log(`${label} tipo:`, typeof obj);
    
    if (obj !== null && typeof obj === 'object') {
      console.log(`${label} propiedades:`, Object.keys(obj));
      console.log(`${label} es array:`, Array.isArray(obj));
      
      if (Array.isArray(obj)) {
        console.log(`${label} longitud:`, obj.length);
        if (obj.length > 0) {
          console.log(`${label} primer elemento:`, obj[0]);
          console.log(`${label} tipo del primer elemento:`, typeof obj[0]);
        }
      }
    }
  }

  /**
   * Carga la lista de héroes desde el servicio
   */
  async loadHeroes() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando héroes...',
      spinner: 'circles'
    });
    
    await loading.present();
    
    this.heroeService.getHeroes().subscribe({
      next: (response) => {
        // Depuramos la respuesta completa
        this.debugObject(response, 'Respuesta API getHeroes');
        
        // Asegurarse de que heroes sea un array
        if (response && Array.isArray(response)) {
          this.heroes = response;
        } else if (response && typeof response === 'object') {
          // Si es un objeto pero no un array, puede ser que la respuesta contenga los héroes en una propiedad
          // Intenta extraer un array de alguna propiedad del objeto
          const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            this.heroes = possibleArrays[0] as Heroe[];
          } else {
            // Si no se puede encontrar un array, convertir a array si es un objeto
            console.warn('La respuesta no es un array de héroes. Intentando convertir:', response);
            this.heroes = Object.values(response).filter(val => 
              typeof val === 'object' && val !== null && 'nombre' in val
            ) as Heroe[];
          }
        } else {
          console.error('Formato de respuesta inesperado:', response);
          this.heroes = [];
          this.errorMessage = 'Error en el formato de datos recibidos.';
        }
        console.log('Heroes procesados:', this.heroes);
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error al cargar héroes:', error);
        this.errorMessage = 'Error al cargar los héroes. Por favor, intente de nuevo.';
        this.heroes = [];
        loading.dismiss();
        this.showToast('No se pudieron cargar los héroes.');
      }
    });
  }

  /**
   * Selecciona un héroe para gestionar sus imágenes
   */
  selectHero(hero: Heroe) {
    if (!hero) {
      this.showToast('Error: Héroe no válido');
      return;
    }
    
    this.selectedHero = hero;
    
    try {
      // Asegurarse de que img sea un array
      if (typeof hero.img === 'string') {
        this.heroImages = [hero.img];
      } else if (Array.isArray(hero.img)) {
        this.heroImages = [...hero.img];
      } else if (!hero.img) {
        this.heroImages = [];
      } else {
        console.warn('Formato de imagen no esperado:', hero.img);
        this.heroImages = [];
      }
    } catch (error) {
      console.error('Error al procesar imágenes del héroe:', error);
      this.heroImages = [];
      this.showToast('Error al cargar las imágenes del héroe');
    }
    
    console.log('Héroe seleccionado:', this.selectedHero);
    console.log('Imágenes cargadas:', this.heroImages);
  }

  /**
   * Agrega una nueva imagen al héroe seleccionado
   */
  async addImage() {
    if (!this.newImageUrl || !this.newImageUrl.trim()) {
      this.showToast('Por favor, ingrese una URL de imagen válida.');
      return;
    }

    if (!this.selectedHero) {
      this.showToast('Por favor, seleccione un héroe primero.');
      return;
    }

    // Verificar si la URL ya existe
    if (this.heroImages.includes(this.newImageUrl)) {
      this.showToast('Esta imagen ya existe en la galería.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Agregando imagen...',
      spinner: 'circles'
    });
    
    await loading.present();

    // Añadir la nueva imagen al array
    this.heroImages.push(this.newImageUrl);
    
    // Actualizar el héroe con el nuevo array de imágenes
    const updatedHero: Heroe = {
      ...this.selectedHero,
      img: this.heroImages
    };

    this.heroeService.crud_Heroes(updatedHero, 'modificar').subscribe({
      next: (response) => {
        loading.dismiss();
        this.showToast('Imagen agregada con éxito.');
        this.newImageUrl = '';
        
        // Actualizar el héroe en la lista de héroes
        this.updateHeroInList(updatedHero);
      },
      error: (error) => {
        loading.dismiss();
        console.error('Error al agregar imagen:', error);
        this.showToast('Error al agregar la imagen. Por favor, intente de nuevo.');
        
        // Revertir cambios locales
        this.heroImages.pop();
      }
    });
  }

  /**
   * Muestra opciones para una imagen específica
   */
  async showImageOptions(imageUrl: string, index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones de imagen',
      buttons: [
        {
          text: 'Ver imagen',
          icon: 'image-outline',
          handler: () => {
            this.viewImage(imageUrl);
          }
        },
        {
          text: 'Eliminar imagen',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.confirmDeleteImage(index);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-circle-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Ver imagen en tamaño completo
   */
  async viewImage(imageUrl: string) {
    const alert = await this.alertCtrl.create({
      header: 'Imagen',
      message: `<img src="${imageUrl}" alt="Imagen de héroe" style="width: 100%;">`,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  /**
   * Confirma la eliminación de una imagen
   */
  async confirmDeleteImage(index: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar imagen?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteImage(index);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Elimina una imagen del héroe
   */
  async deleteImage(index: number) {
    if (!this.selectedHero) return;

    const loading = await this.loadingCtrl.create({
      message: 'Eliminando imagen...',
      spinner: 'circles'
    });
    
    await loading.present();

    // Guardar la imagen que vamos a eliminar (para poder revertir si hay error)
    const removedImage = this.heroImages[index];
    
    // Eliminar la imagen del array
    this.heroImages.splice(index, 1);
    
    // Si no quedan imágenes, asegurar que haya al menos una imagen por defecto
    if (this.heroImages.length === 0) {
      this.heroImages.push('assets/img/no-image.png');
    }
    
    // Actualizar el héroe con el nuevo array de imágenes
    const updatedHero: Heroe = {
      ...this.selectedHero,
      img: this.heroImages
    };

    this.heroeService.crud_Heroes(updatedHero, 'modificar').subscribe({
      next: (response) => {
        loading.dismiss();
        this.showToast('Imagen eliminada con éxito.');
        
        // Actualizar el héroe en la lista de héroes
        this.updateHeroInList(updatedHero);
      },
      error: (error) => {
        loading.dismiss();
        console.error('Error al eliminar imagen:', error);
        this.showToast('Error al eliminar la imagen. Por favor, intente de nuevo.');
        
        // Revertir cambios locales
        this.heroImages.splice(index, 0, removedImage);
      }
    });
  }

  /**
   * Actualiza un héroe en la lista local de héroes
   */
  private updateHeroInList(hero: Heroe) {
    const index = this.heroes.findIndex(h => h._id === hero._id);
    if (index !== -1) {
      this.heroes[index] = { ...hero };
      this.selectedHero = { ...hero };
    }
  }

  /**
   * Muestra un mensaje de toast
   */
  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    
    await toast.present();
  }

  /**
   * Limpia la selección actual
   */
  clearSelection() {
    this.selectedHero = null;
    this.heroImages = [];
    this.newImageUrl = '';
  }

  /**
   * Obtiene el número de imágenes de un héroe
   */
  getImageCount(hero: Heroe): number {
    if (Array.isArray(hero.img)) {
      return hero.img.length;
    } else if (typeof hero.img === 'string' && hero.img) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Verifica si una URL de imagen es válida
   */
  isValidImageUrl(url: string): boolean {
    // Expresión regular simple para validar URLs de imágenes
    const pattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i;
    return pattern.test(url);
  }
}