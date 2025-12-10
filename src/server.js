const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());

// Para recibir archivos enviados desde Angular
const upload = multer();

app.post('/enviar-correo', upload.single('archivo'), async (req, res) => {
  try {
    const archivoPDF = req.file;
    const correoDestino = req.body.correo;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'emanuel.camargoq@pca.edu.co',
        pass: 'Emanuel12345$'
      }
    });

    await transporter.sendMail({
      from: 'fundacionavanzasinlimites@gmail.com',
      to: correoDestino,
      subject: 'Reporte Jurídico',
      text: 'Adjunto se envía el reporte en formato PDF.',
      attachments: [
        {
          filename: 'reporte.pdf',
          content: archivoPDF.buffer
        }
      ]
    });

    res.json({ ok: true, mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error enviando correo' });
  }
});

app.listen(3000, () => {
  console.log('Servidor de correo funcionando en http://localhost:3000');
});
