import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_HEROES } from '../config/url.servicios';
import { map } from 'rxjs';
import { Heroe } from '../interfaces/heroes.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroesBDService {

  constructor(private http: HttpClient) { }

  getHeroes(): any {
    let url = `${URL_HEROES}/heroes`;


    return this.http.get(url).pipe(
      map((data) => {
        console.log('DATOS', data);
        return data;
      })
    );
  }

  getUnHeroe(unHeroe:string):any{
    let url = `${URL_HEROES}/heroes/${unHeroe}`;


    return this.http.get(url, {}).pipe(
      map((data: any) => {
        //console.log('PERSONAJES_RK',res);
        return data;
      })
    );
  }


  crud_Heroes(unHeroe: Heroe, unaAccion: string):any {


    if (unaAccion === 'eliminar') {

      let url = `${URL_HEROES}/heroes/${unHeroe._id}`;

      return this.http.delete(url).pipe(
        map((data) => {
          return data;
        })
      );
    }

    /*
    nombre: string;
    bio: string;
    img: string;
    aparicion: string;
    casa: string;
    _id?: string;
    */
    if (unaAccion === 'insertar') {
      let url = `${URL_HEROES}/heroes`;

      const body = {
        nombre:unHeroe.nombre,
        bio:unHeroe.bio,
        img:unHeroe.img,
        aparicion:unHeroe.aparicion,
        casa:unHeroe.casa,
      };


      return this.http.post(url, body).pipe(map((data) => data));
    }


    if (unaAccion === 'modificar') {

      let url = `${URL_HEROES}/heroes/${unHeroe._id}`;


      const body = {
        nombre:unHeroe.nombre,
        bio:unHeroe.bio,
        img:unHeroe.img,
        aparicion:unHeroe.aparicion,
        casa:unHeroe.casa,
      };

      return this.http.put(url, body).pipe(map((data) => data));
    }
  }

  


}
