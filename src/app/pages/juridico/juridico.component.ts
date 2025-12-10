import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-juridico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './juridico.component.html',
  styleUrls: ['./juridico.component.css']
})
export class JuridicoComponent {

  formData: any = {
    nombre: '',
    documento: '',
    edad: '',
    nacimiento: '',
    municipio: '',
    direccion: '',
    telefono: '',
    correo: '',
    discapacidad: [] as string[],
    certificado: '',
    apoyos: [] as string[],
    acudiente: '',
    parentesco: '',
    acudienteDoc: '',
    acudienteTel: '',
    area: [] as string[],
    motivo: '',
    consentimientoNombre: '',
    consentimientoFecha: ''
  };

  generatedPdfBlob!: Blob;

  // -------------------------------------------------------------------
  // GENERAR PDF
  // -------------------------------------------------------------------
  generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('FORMULARIO JURÍDICO – CONSULTORIO INCLUSIVO', 10, 10);

    (doc as any).autoTable({
      startY: 20,
      head: [['Campo', 'Valor']],
      body: [
        ['Nombre completo', this.formData.nombre],
        ['Documento', this.formData.documento],
        ['Edad', this.formData.edad],
        ['Fecha de nacimiento', this.formData.nacimiento],
        ['Municipio', this.formData.municipio],
        ['Dirección', this.formData.direccion],
        ['Teléfono', this.formData.telefono],
        ['Correo', this.formData.correo],
        ['Tipo discapacidad', this.formData.discapacidad.join(', ')],
        ['Certificado', this.formData.certificado],
        ['Apoyos', this.formData.apoyos.join(', ')],
        ['Acudiente', this.formData.acudiente],
        ['Parentesco', this.formData.parentesco],
        ['Documento acudiente', this.formData.acudienteDoc],
        ['Teléfono acudiente', this.formData.acudienteTel],
        ['Área del derecho', this.formData.area.join(', ')],
        ['Motivo', this.formData.motivo],
        ['Consentimiento nombre', this.formData.consentimientoNombre],
        ['Fecha', this.formData.consentimientoFecha]
      ]
    });

    this.generatedPdfBlob = doc.output('blob');
    return this.generatedPdfBlob;
  }

  // -------------------------------------------------------------------
  // ENVIAR FORMULARIO + PDF AL BACKEND PARA CORREO
  // -------------------------------------------------------------------
  async enviarFormulario() {
    const pdfBlob = this.generatePDF();

    const formDataSend = new FormData();
    formDataSend.append('archivo', pdfBlob, 'formulario_juridico.pdf');
    formDataSend.append('correo', this.formData.correo); // correo del destinatario

    try {
      const resp = await fetch('http://localhost:3000/enviar-correo', {
        method: 'POST',
        body: formDataSend
      });

      const result = await resp.json();

      if (result.ok) {
        alert('Formulario y PDF enviados correctamente');
      } else {
        alert('Error al enviar el formulario');
      }

    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor de correo');
    }
  }

  // -------------------------------------------------------------------
  // FUNCIONES CHECKBOX (discapacidad, apoyos, área)
  // -------------------------------------------------------------------
  toggleSelection(field: string, value: string) {
    const arr = this.formData[field] as string[];
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    } else {
      arr.push(value);
    }
  }

  // -------------------------------------------------------------------
  // FUNCIONES RADIO BUTTON
  // -------------------------------------------------------------------
  setRadio(field: string, value: string) {
    this.formData[field] = value;
  }
}
