import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";

import { EstudianteDTO } from "../schemas";
export const generar_listado_de_estudiantes = async  (estudiantes: EstudianteDTO[], titulo='Listado de Estudiantes') => {
console.log("Generando listado de estudiantes");

// Simulamos un tiempo de procesamiento
await new Promise((resolve) => setTimeout(resolve, 1000));


// Crear una instancia de jsPDF
const doc = new jsPDF();

// Título del documento
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.text(titulo, 10, 20);


// Extraer los datos para la tabla
const encabezado = [['Cedula', 'Nombres', 'Apellidos', 'Telefono','Correo Electronico']];
const cuerpo = estudiantes.map(est => 
    [
        `V-${est.cedula.toLocaleString('es-VE')}`,
        est.nombres,
        est.apellidos,
        est.telefono,
        est.correo,
    ]);

// Generar la tabla
autoTable(doc, {
  startY: 30,
  theme: 'grid',
  head: encabezado,
  body: cuerpo,
});


// Guardar el PDF
doc.save("listado_estudiantil.pdf");
};