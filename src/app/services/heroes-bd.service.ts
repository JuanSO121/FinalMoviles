import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_HEROES } from '../config/url.servicios';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Heroe } from '../interfaces/heroes.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroesBDService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los héroes
   * @returns Observable con el listado de héroes
   */
  getHeroes(): Observable<Heroe[]> {
    const url = `${URL_HEROES}/heroes`;

    return this.http.get<Heroe[]>(url).pipe(
      map((response) => {
        console.log('DATOS', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un héroe específico
   * @param id ID del héroe a buscar
   * @returns Observable con el héroe encontrado
   */
  getUnHeroe(id: string): Observable<Heroe> {
    const url = `${URL_HEROES}/heroes/${id}`;

    return this.http.get<Heroe>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Realiza operaciones CRUD sobre héroes
   * @param heroe Datos del héroe
   * @param accion Acción a realizar (insertar, modificar, eliminar)
   * @returns Observable con la respuesta del servidor
   */
  crud_Heroes(heroe: Heroe, accion: 'insertar' | 'modificar' | 'eliminar'): Observable<any> {
    
    // Procesar correctamente el array de imágenes antes de enviarlo
    const heroeToSend = this.prepareHeroeData(heroe);
    
    switch (accion) {
      case 'eliminar':
        const deleteUrl = `${URL_HEROES}/heroes/${heroe._id}`;
        return this.http.delete(deleteUrl).pipe(
          catchError(this.handleError)
        );
        
      case 'insertar':
        const postUrl = `${URL_HEROES}/heroes`;
        return this.http.post(postUrl, heroeToSend).pipe(
          catchError(this.handleError)
        );
        
      case 'modificar':
        const putUrl = `${URL_HEROES}/heroes/${heroe._id}`;
        return this.http.put(putUrl, heroeToSend).pipe(
          catchError(this.handleError)
        );
        
      default:
        return throwError(() => new Error('Acción no válida'));
    }
  }

  /**
   * Prepara los datos del héroe para enviarlos al servidor
   * Asegura que el campo img se maneje correctamente
   * @param heroe Datos del héroe
   * @returns Objeto con los datos preparados
   */
  private prepareHeroeData(heroe: Heroe): any {
    // Crea un nuevo objeto en lugar de modificar el original
    const heroeData: Partial<Heroe> = {
      nombre: heroe.nombre,
      bio: heroe.bio,
      aparicion: heroe.aparicion,
      casa: heroe.casa
    };
    
    // Maneja el campo img correctamente
    if (typeof heroe.img === 'string') {
      heroeData.img = [heroe.img];
    } else {
      heroeData.img = heroe.img;
    }
    
    // Solo incluye el _id si existe y no es una operación de inserción
    if (heroe._id) {
      heroeData._id = heroe._id;
    }
    
    return heroeData;
  }

  /**
   * Maneja los errores HTTP
   * @param error Error HTTP
   * @returns Observable con el error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}