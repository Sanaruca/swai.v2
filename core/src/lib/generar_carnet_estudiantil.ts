import jsPDF from 'jspdf';
import { EstudianteDTO } from '../schemas';

export async function generar_carnet_estudiantil(estudiante: EstudianteDTO) {
  const doc = new jsPDF();

  const imagenFrontalUrl =
    process.env['NX_SWAI_ORIGIN'] + '/img/templates/cf.png';
  const imagenPosteriorUrl =
    process.env['NX_SWAI_ORIGIN'] + '/img/templates/cp.png';

  function cargarImagen(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  try {
    const [imgFrontal, imgPosterior] = await Promise.all([
      cargarImagen(imagenFrontalUrl),
      cargarImagen(imagenPosteriorUrl),
    ]);

    const width = 60;
    const aspectRatio = imgFrontal.height / imgFrontal.width;
    const height = width * aspectRatio;

    doc.addImage(imgFrontal, 'PNG', 10, 10, width, height);
    doc.addImage(imgPosterior, 'PNG', 10 + width + 10, 10, width, height);

    const _nombre = estudiante.nombres.split(' ')[0];
    const _apellido = estudiante.apellidos.split(' ')[0];
    let nombre = `${_nombre} ${_apellido}`;

    if (nombre.length > 18) {
      nombre = `${_nombre.charAt(0)}. ${_apellido}`;
    }

    // Calcular la posición central
    const textWidth = doc.getTextWidth(nombre);
    const textX = 10 + width / 2 - textWidth / 2; // Centrado en la imagen
    const textY = 68; // 10 + (height / 2); // Centrado verticalmente
    doc.addFont(
      '/fonts/Montserrat-Regular.ttf',
      'Montserrat-Regular',
      'normal'
    );
    doc.addFont('/fonts/Montserrat-Medium.ttf', 'Montserrat-Medium', 'normal');

    // nombre
    doc.setFont('Montserrat-Medium');
    doc.setFontSize(14);
    doc.setTextColor('#FF6D35'); // Naranja fuerte en HEX
    doc.text(nombre, textX + 1, textY); // ojo %

    // info
    const cedula = `V-${estudiante.cedula.toLocaleString('es-VE')}`;
    const fechaActual = new Date();
    const año_actual = fechaActual.getFullYear();
    const año_anterior = año_actual - 1;
    const periodo_academico = `${año_anterior} - ${año_actual}`;
    const nivel_academico = estudiante.nivel_academico.nombre

    doc.setFont('Montserrat-Regular');
    doc.setFontSize(6);
    doc.setTextColor('#002636'); // Azul marino en HEX
    doc.text(cedula, 10 + (width/2)-3, 80); // ojo %
    doc.text(periodo_academico, 10 + (width/2)-3, 83.5); // ojo %
    doc.text(nivel_academico, 10 + (width/2)-3, 87); // ojo %

    doc.save('carnet_estudiantil.pdf');
  } catch (error) {
    console.error('Error al cargar imágenes:', error);
  }
}
