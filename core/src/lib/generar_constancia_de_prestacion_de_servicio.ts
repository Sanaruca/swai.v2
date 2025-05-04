import { jsPDF } from 'jspdf';
import { EmpleadoDTO } from '../schemas';

// Función para obtener el día y mes actual en español
const getDayAndMonth = () => {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const date = new Date();
  const day = date.getDate();
  const month = months[date.getMonth()];

  return { day, month };
};

// Generación de PDF usando jsPDF
export const generar_constancia_de_prestacion_de_servicio = async (
  empleado: EmpleadoDTO
) => {
  console.log(
    'Generando constancia para:',
    `${empleado.nombres} ${empleado.apellidos}`
  );

  // Simulamos un tiempo de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Obtener dimensiones de la página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const leftMargin = 20;
    const rightMargin = 20;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    // Configurar fuente y tamaño para el encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);

    // Encabezado centrado en negrita
    doc.text('REPÚBLICA BOLIVARIANA DE VENEZUELA', pageWidth / 2, 20, {
      align: 'center',
    });
    doc.text(
      'MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN',
      pageWidth / 2,
      28,
      { align: 'center' }
    );
    doc.text('COMPLEJO EDUCATIVO MIGUEL JOSÉ SANZ', pageWidth / 2, 36, {
      align: 'center',
    });
    doc.text('Código de plantel: S0347D1608', pageWidth / 2, 44, {
      align: 'center',
    });
    doc.text('MATURÍN MONAGAS', pageWidth / 2, 52, { align: 'center' });

    // Salto de línea y título
    doc.text('CONSTANCIA DE PRESTACIÓN DE SERVICIO', pageWidth / 2, 68, {
      align: 'center',
    });

    // Configurar texto normal para el contenido
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    // Contenido con márgenes
    const contentY = 80;

    const fechaActual = new Date();
    const año_actual = fechaActual.getFullYear();
    const año_anterior = año_actual - 1;

    // Texto principal con los datos del empleado
    const contentText =
      'Quien suscribe, Director del Plantel: Prof. Luis E. Martínez P. CI: V-15.788.669; ' +
      'por medio de la presente, hace constar que el ciudadano(a): ' +
      `${empleado.nombres} ${empleado.apellidos}, ` +
      `titular de la cedula de identidad N°.V-${empleado.cedula.toLocaleString(
        'es-VE'
      )}, ` +
      `presta sus servicios en esta institución para este año escolar: ${año_anterior}-${año_actual}, como como personal en función: ` +
      `_________________________. ` +
      `código: ______________, cargo nominal: ______________, caga horaria: __________________ en el área de formación: _________________ adscrita a la dependencia: ___________________ código: ____________ solicita traslado y no genera vacante en esta casa de estudio.`;

    // Dividir el texto en múltiples líneas para que quepa en la página
    const splitContentText = doc.splitTextToSize(contentText, contentWidth);
    doc.text(splitContentText, leftMargin, contentY);

    // Texto de la parte inferior - posicionado en la parte inferior de la página
    const { day, month } = getDayAndMonth();
    const bottomText =
      `Constancia que se expide a solicitud de la parte interesada, en Maturín a los (${day}) ` +
      `días del mes de ${month} del año ${año_actual}`;

    // Dividir el texto inferior en múltiples líneas
    const splitBottomText = doc.splitTextToSize(bottomText, contentWidth);

    // Calcular alturas para posicionar en la parte inferior
    const bottomTextHeight = splitBottomText.length * 7;
    const signatureHeight = 40; // Altura aproximada para las 4 líneas de firma (4 * 8 + margen)
    const footerHeight = bottomTextHeight + signatureHeight;

    // Posicionar el texto inferior a una distancia fija desde el fondo
    const bottomTextY = pageHeight - footerHeight - 30; // 30 puntos desde el fondo
    doc.text(splitBottomText, leftMargin, bottomTextY);

    // Posicionar la firma después del texto inferior
    const signatureY = bottomTextY + bottomTextHeight + 15;

    // Firma centrada
    doc.text('Prof. Luis E. Martinez P.', pageWidth / 2, signatureY, {
      align: 'center',
    });
    doc.text('CI: V-15.788.669', pageWidth / 2, signatureY + 8, {
      align: 'center',
    });
    doc.text('DIRECTOR(E)', pageWidth / 2, signatureY + 16, {
      align: 'center',
    });
    doc.text('Telf. 0412-0879640', pageWidth / 2, signatureY + 24, {
      align: 'center',
    });

    // Guardar el PDF y descargarlo
    doc.save(`constancia_de_prertacion_de_servicio_${empleado.cedula}.pdf`);

    return true;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  }
};
