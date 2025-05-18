export interface Heroe {
  nombre: string;
  bio: string;
  img: string[] | string;
  aparicion: string;
  casa: string;
  _id?: string; // Marcado como opcional con el símbolo ?
}


//Generado por la IA, pasandole el JSON  
export  interface Personaje {
    _id: string;
    nombre: string;
    bio: string;
    img: string[] | string; 
    aparicion: string; // ISO date string
    casa: string;
  }