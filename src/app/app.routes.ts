import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MisionVisionValoresComponent } from './pages/mision-vision-valores/mision-vision-valores.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { AfiliacionComponent } from './pages/afiliacion/afiliacion.component';
import { JuridicoComponent } from './pages/juridico/juridico.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home-ultimas-noticias', component: HomeComponent }, // Placeholder - crear componente después
  { path: 'mision-vision-valores', component: MisionVisionValoresComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'afiliacion', component: AfiliacionComponent },
  { path: 'juridico', component: JuridicoComponent }
];
