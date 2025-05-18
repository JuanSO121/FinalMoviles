import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';


import { IonicModule } from '@ionic/angular';

const storage = new Storage();
storage.create(); 

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    { provide: Storage, useValue: storage },
    provideRouter(routes, withPreloading(PreloadAllModules)),

    //Http Client  
    provideHttpClient(),

    //Importar estas dos librerias para los proyecto Standalone
    importProvidersFrom(IonicModule.forRoot(), 
    //FormsModule
    )
  ],
});
