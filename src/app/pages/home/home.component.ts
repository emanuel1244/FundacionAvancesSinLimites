import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements AfterViewInit {
  activeSlideIndex: number = 0;

  // Logo de la fundación
  logoPath = 'assets/Logo-FASL-Color.png';

  momentPhotos = [
    'fundacion.jpeg',
    'fundacion1.jpeg',
    'fundacion2.jpeg',
    'fundacion3.jpeg',
    'fundacion4.jpeg',
    'fundacion6.jpeg',
    'fundacion7.jpeg',
    'fundacion8.jpeg'
  ];

  // Hero carousel images (use your images from src/image -> assets/)
  heroPhotos = [
    'fundacion1.jpeg',
    'fundacion2.jpeg',
    'fundacion3.jpeg',
    'fundacion9.jpg',
    'fundacion10.jpg'
  ];

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngAfterViewInit() {
    const carouselElement = document.getElementById('sectionSlider');
    if (carouselElement) {
      carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
        this.activeSlideIndex = event.to;
        this.cdr.detectChanges();
      });
    }
  }

  onVerMisionVisionValores() {
    this.router.navigate(['/mision-vision-valores']);
  }

  onVerTodasNoticias() {
    this.router.navigate(['/home-ultimas-noticias']);
  }

  // Helper to accept either a string (filename) or an object { src, pos }
  getPhotoSrc(photo: any): string {
    return 'assets/' + (photo && photo.src ? photo.src : photo);
  }

  getPhotoPos(photo: any): string {
    return (photo && photo.pos) ? photo.pos : 'center';
  }

  // Método para probar notificaciones
  testNotification() {
    const notifications = [
      {
        title: 'Prueba Exitosa',
        message: 'El sistema de notificaciones está funcionando correctamente.',
        type: 'success' as const
      },
      {
        title: 'Nueva Donación',
        message: 'Se ha recibido una donación de $25.000 COP.',
        type: 'info' as const
      },
      {
        title: 'Evento Recordatorio',
        message: 'No olvides el taller de mañana a las 3:00 PM.',
        type: 'warning' as const
      }
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    this.notificationService.addNotification(randomNotification);
  }
}
