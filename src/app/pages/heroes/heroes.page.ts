import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Heroe } from 'src/app/interfaces/heroes.interface';
import { HeroesBDService } from 'src/app/services/heroes-bd.service';
import { HeroesListComponent } from 'src/app/components/heroes-list/heroes-list.component';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.page.html',
  styleUrls: ['./heroes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    
    HeroesListComponent
  ]
})
export class HeroesPage implements OnInit {

  heroes: Heroe[] = [];

  constructor(private bdHeroes: HeroesBDService) { }

  ngOnInit() {
    this.cargarHeroes();
  }

  //El metodo que va a cargar los personajes
  async cargarHeroes() {
    //this.cargando = true;
    await this.bdHeroes
      .getHeroes()
      .toPromise()
      .then((data: any) => {
        //Aqui se realiza la asignacion de los personajes de la respuesta
        this.heroes = data.resp;

        console.log("MISHEROES", this.heroes);

        //this.url_next = resp.info.next;
        //console.log("SIGUIENTE", this.url_next);

      });
  }

  async recargarHeroes(id: string) {
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
  }  

  async ionViewWillEnter() {
    await this.recargarHeroes('');
  }
  
 

}
