import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements AfterViewInit {
  activeSlideIndex: number = 0;

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

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

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
}
