import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent {
  eventos = [
    {
      id: 1,
      titulo: 'Maratón de Sueños',
      imagen: 'assets/fundacion.jpeg',
      descripcion: 'Carrera de 5K, que se realiza en diferentes ciudades nacionales e internacionales, en donde pones a prueba tu capacidad de amar, buscando cumplir los sueños de muchos niños, niñas y jóvenes con discapacidad. Marca la diferencia y disfruta entregando amor y solidaridad.',
      detalles: 'La próxima Maratón se efectuará en la ciudad de Barranquilla – Atlántico, el día viernes 04 de diciembre de 2024.',
      llamada: 'Si deseas estar en la Maratón de Barranquilla como participante (persona con discapacidad y acompañante) puedes inscribírte dando clic en el botón.',
      objetivo: 'Si quieres participar con el objetivo de ayudar a los niños y jóvenes con discapacidad, para que tengan una excelente calidad de vida y puedan potenciar sus aptitudes a través de la educación, puedes inscribírte dando clic en el botón:'
    },
    {
      id: 2,
      titulo: 'Taller de Inclusión',
      imagen: 'assets/fundacion1.jpeg',
      descripcion: 'Programa de sensibilización sobre discapacidad y derechos humanos. Un espacio educativo y enriquecedor donde aprenderás sobre inclusión real y significativa.',
      detalles: 'El próximo taller se llevará a cabo el 15 de diciembre de 2024 en Bogotá.',
      llamada: 'Participa y sé parte de esta experiencia transformadora.',
      objetivo: 'Coadyuva a la formación de ciudadanos comprometidos con la inclusión.'
    },
    {
      id: 3,
      titulo: 'Encuentro Familiar',
      imagen: 'assets/fundacion2.jpeg',
      descripcion: 'Celebración de encuentros familiares con actividades inclusivas para toda la familia. Un espacio de convivencia, alegría y solidaridad.',
      detalles: 'El próximo encuentro será el 22 de diciembre de 2024 en nuestras instalaciones.',
      llamada: 'Anímate a participar en este hermoso evento familiar.',
      objetivo: 'Fortalece los lazos familiares mientras apoyas nuestra causa.'
    },
    {
      id: 4,
      titulo: 'Capacitación Emprendimiento',
      imagen: 'assets/fundacion3.jpeg',
      descripcion: 'Formación en habilidades empresariales y negocios inclusivos. Desarrolla tus competencias emprendedoras con nosotros.',
      detalles: 'La capacitación se realizará el 10 de enero de 2025 en modalidad presencial y virtual.',
      llamada: 'Inscríbete en este proceso de formación integral.',
      objetivo: 'Potencia tu capacidad emprendedora en un ambiente de inclusión.'
    }
  ];

  eventoSeleccionado = this.eventos[0];

  seleccionarEvento(evento: any) {
    this.eventoSeleccionado = evento;
  }
}
