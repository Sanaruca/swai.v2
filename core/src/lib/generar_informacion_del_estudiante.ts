import { jsPDF } from 'jspdf';
import { EstudianteDTO } from "../schemas";

export function generar_informacion_del_estudiante(estudiante: EstudianteDTO) {
  const doc = new jsPDF();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Ficha del Estudiante', 20, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const datos = [
    `Cédula: ${estudiante.cedula}`,
    `Nombre: ${estudiante.nombres} ${estudiante.apellidos}`,
    `Fecha de Inscripción: ${estudiante.fecha_de_inscripcion?.toLocaleDateString() ?? 'No disponible'}`,
    `Nivel Académico: ${estudiante.nivel_academico.numero}`,
    `Tipo de Estudiante: ${estudiante.tipo}`,
    `Sección: ${estudiante.seccion}`,
    `Peso: ${estudiante.peso} kg`,
    `Estatura: ${estudiante.estatura} cm`,
    `Municipio de Nacimiento: ${estudiante.municipio_de_nacimiento.nombre}`,
    `Fecha de Egreso: ${estudiante.fecha_de_egreso?.toLocaleDateString() ?? 'No disponible'}`,
  ];

  let y = 40;
  datos.forEach((linea) => {
    doc.text(linea, 20, y);
    y += 10;
  });

  doc.save('Estudiante.pdf');
};
