// src/app/utils/export-matricula-with-table.ts

import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import {
  EstudianteDTO, InstitucionDTO,
  MES_NOMBRE_MAP,
  NIVEL_ACADEMICO_CARDINAL_MAP,
  TIPO_DE_ESTUDIANTE
} from '../schemas';

export interface TemplateVars {
  CODIGO_PLANTEL: string;
  MUNICIPIO: string;
}

export interface Matricula {
  institucion: InstitucionDTO;
  nivel_academico: number;
  seccion: string;
  estudiantes: EstudianteDTO[];
  plan_de_estudio?: {
    codigo: string;
    nombre: string;
  };
  periodo_academico?: `${number}-${number}`; // Formato: "2023-2024"
  fecha_de_la_matricula?: Date;
}

/**
 * Genera y descarga un XLSX basándose en un template que contiene
 * una tabla de Excel (ListObject) llamada "TableMatriculas".
 */
export async function generar_matricula_de_estudiantes(
  data: Matricula | Matricula[],
  file_name = 'matriculas'
) {
  // 1) Carga el template
  const template = await fetch('/assets/templates/xlsx/matricula.xlsx');
  const template_buffer = await template.arrayBuffer();
  const template_libro = new Workbook();
  await template_libro.xlsx.load(template_buffer, {ignoreNodes: ['autoFilter']});
  const template_hoja = template_libro.getWorksheet('template');

  if (!template_hoja) {
    throw new Error(
      "La hoja 'template' no se encuentra en el archivo de plantilla."
    );
  }

  const matriculas = Array.isArray(data) ? data : [data];

  for (const matricula of matriculas) {
    // if(!matricula.estudiantes.length) continue
    // Clona la hoja del template
    const hoja = template_libro.addWorksheet(
      `${NIVEL_ACADEMICO_CARDINAL_MAP[matricula.nivel_academico]} "${
        matricula.seccion
      }"`
    );

    // Copia el contenido de la hoja template a la nueva hoja
    template_hoja.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const newRow = hoja.getRow(rowNumber);
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        newRow.getCell(colNumber).value = cell.value;
        newRow.getCell(colNumber).style = { ...cell.style };
      });
      newRow.height = row.height;
    });

    const fecha_actual = new Date()

    hoja.getCell('N1').value = hoja.getCell('N1')?.value?.toString()?.replace(/{{PREIODO_ESCOLAR}}/g, matricula.institucion.periodo_academico_actual);

    hoja.getCell('N2').value = hoja.getCell('N2')?.value?.toString()?.replace(/{{MES}}/g, MES_NOMBRE_MAP[fecha_actual.getMonth()].toUpperCase());
    hoja.getCell('N2').value = hoja.getCell('N2')?.value?.toString()?.replace(/{{AÑO}}/g, fecha_actual.getFullYear().toString());

    hoja.getCell('A4').value = hoja.getCell('A4')?.value?.toString()?.replace(/{{CODIGO_PLANTEL}}/g, matricula.institucion.plantel_educativo.dea);
    hoja.getCell('A5').value = hoja.getCell('A5')?.value?.toString()?.replace(/{{MUNICIPIO}}/g, matricula.institucion.municipio.nombre);
    
    hoja.getCell('D4').value = hoja.getCell('D4')?.value?.toString()?.replace(/{{INSTITUCION_NOMBRE}}/g, matricula.institucion.nombre);
    hoja.getCell('D5').value = hoja.getCell('D5')?.value?.toString()?.replace(/{{INSTITUCION_TELEFONO}}/g, matricula.institucion.telefono || '**********');

    hoja.getCell('D6').value = hoja.getCell('D6')?.value?.toString()?.replace(/{{INSTITUCION_ENTIDAD_FEDERAL}}/g, matricula.institucion.municipio.estado_federal.nombre);
    hoja.getCell('I6').value = hoja.getCell('I6')?.value?.toString()?.replace(/{{ZONA_EDUCATIVA}}/g, matricula.institucion.municipio.estado_federal.nombre);
    
    
    hoja.getCell('D7').value = hoja.getCell('D7')?.value?.toString()?.replace(/{{PLAN_DE_ESTUDIOS}}/g, matricula.plan_de_estudio?.nombre || 'EDUCACION MEDIA GENERAL');
    hoja.getCell('I7').value = hoja.getCell('I7')?.value?.toString()?.replace(/{{CODIGO}}/g, matricula.plan_de_estudio?.codigo || '31059');
    
    hoja.getCell('A8').value = hoja.getCell('A8')?.value?.toString()?.replace(/{{NIVEL_ACADEMICO}}/g, NIVEL_ACADEMICO_CARDINAL_MAP[matricula.nivel_academico] + ' Año');
    hoja.getCell('D8').value = hoja.getCell('D8')?.value?.toString()?.replace(/{{SECCION}}/g, matricula.seccion);
    hoja.getCell('I8').value = hoja.getCell('I8')?.value?.toString()?.replace(/{{NUMERO_INSCRITOS}}/g, matricula.estudiantes.length.toString());



    hoja.mergeCells('A11:A12')
    hoja.mergeCells('B11:B12')
    hoja.mergeCells('C11:C12')
    hoja.mergeCells('D11:D12')
    hoja.mergeCells('E11:E12')
    hoja.mergeCells('F11:F12')
    hoja.mergeCells('G11:H11')
    hoja.mergeCells('I11:K11')
    hoja.mergeCells('L11:N11')

    // Agrega los estudiantes
    matricula.estudiantes.forEach((estudiante, index) => {



      hoja.insertRow(14 + index,[
        (index + 1).toString().padStart(2, '0'),
        'V-' + estudiante.cedula.toLocaleString('es-VE'),
        `${estudiante.nombres} ${estudiante.apellidos}`,
        estudiante.fecha_de_inscripcion?.toLocaleDateString('es-VE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),

        estudiante.sexo,
        estudiante.edad,
        estudiante.municipio_de_nacimiento.estado_federal.nombre
          .toUpperCase()
          .substring(0, 2),
        estudiante.municipio_de_nacimiento.nombre,
        (estudiante.fecha_de_nacimiento.getDay() + 1).toString().padStart(2, '0'),
        (estudiante.fecha_de_nacimiento.getMonth() + 1).toString().padStart(2, '0'),
        estudiante.fecha_de_nacimiento.getFullYear(),
        estudiante.tipo.id === TIPO_DE_ESTUDIANTE.REGULAR ? 'X' : '',
        estudiante.tipo.id === TIPO_DE_ESTUDIANTE.REPITIENTE ? 'X' : '',
        estudiante.materias_pendientes
          ?.map((materia) => materia.codigo)
          .join('-') || '',
      ], 'i+');
    });

    hoja.spliceRows(13, 1)
    hoja.getColumn('A').width = 4
    hoja.getColumn('B').width = 12
    hoja.getColumn('C').width = 42

    hoja.getColumn('E').width = 6
    hoja.getColumn('F').width = 6
    hoja.getColumn('G').width = 4

    hoja.getColumn('H').width = 15

    hoja.getColumn('I').width = 4
    hoja.getColumn('J').width = 4
    hoja.getColumn('K').width = 6

    hoja.getColumn('L').width = 4
    hoja.getColumn('M').width = 4
    hoja.getColumn('N').width = 4
  }

  // Elimina la hoja template original
  template_libro.removeWorksheet('template');

  // Guarda el archivo
  const buffer = await template_libro.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), file_name + '.xlsx');
}
