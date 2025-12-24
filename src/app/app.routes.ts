import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MisionVisionValoresComponent } from './pages/mision-vision-valores/mision-vision-valores.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { AfiliacionComponent } from './pages/afiliacion/afiliacion.component';
import { JuridicoComponent } from './pages/juridico/juridico.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NewsComponent } from './pages/news/news.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home-ultimas-noticias', component: NewsComponent }, // Redirigir a la página de noticias
  { path: 'mision-vision-valores', component: MisionVisionValoresComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'afiliacion', component: AfiliacionComponent },
  { path: 'juridico', component: JuridicoComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'news', component: NewsComponent },
  { path: 'noticias', component: NewsComponent }, // Alias en español
  { path: '**', redirectTo: 'home' }
];
