import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent {
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
    'fundacion3.jpeg'
  ];

  constructor(private router: Router) {}

  onVerMisionVisionValores() {
    this.router.navigate(['/mision-vision-valores']);
  }
}
