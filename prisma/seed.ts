import { PrismaClient } from '@prisma/client';
import { ESTADOS_ACADEMICOS, NIVELES_ACADEMICOS, ROLES } from '../core/src';
const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.estados_academicos.createMany({
      data: ESTADOS_ACADEMICOS,
    }),

    prisma.tipos_de_discapacidad.createMany({
      data: [
        { id: 1, nombre: 'Motriz' },
        { id: 2, nombre: 'Visual' },
        { id: 3, nombre: 'Mental' },
        { id: 4, nombre: 'Auditiva' },
        { id: 5, nombre: 'De lenguaje' },
        { id: 6, nombre: 'Sesorial' },
      ],
    }),

    prisma.modulos.createMany({
      data: [
        {
          nombre: 'DOCENTES',
          descripcion: 'Modulo docentes.',
        },
        {
          nombre: 'ESTUDIANTES',
          descripcion: 'Modulo estudaintes.',
        },
        {
          nombre: 'VENEZUELA',
          descripcion:
            'Modulo Venezuela contiene datos y entidades relacionadas al pais.',
        },
        {
          nombre: 'SALONES',
          descripcion: 'Modulo para la gestion de salones de clase.',
        },
      ],
    }),
    prisma.roles_de_usuario.createMany({
      data: ROLES,
    }),
    prisma.permisos.createMany({
      data: [
        {
          id: 1,
          modulo: 'DOCENTES',
          rol: 'ADMIN',
          puede_consultar: true,
          puede_editar: true,
          puede_registrar: true,
          puede_eliminar: true,
        },
        {
          id: 2,
          modulo: 'ESTUDIANTES',
          rol: 'ADMIN',
          puede_consultar: true,
          puede_editar: true,
          puede_registrar: true,
          puede_eliminar: true,
        },
        {
          id: 3,
          modulo: 'VENEZUELA',
          rol: 'ADMIN',
          puede_consultar: true,
          puede_editar: false,
          puede_registrar: false,
          puede_eliminar: false,
        },
        {
          id: 4,
          modulo: 'SALONES',
          rol: 'ADMIN',
          puede_consultar: true,
          puede_editar: true,
          puede_registrar: true,
          puede_eliminar: true,
        },
      ],
    }),
    prisma.sexos.createMany({
      data: [
        {
          id: 'M',
          nombre: 'Masculino',
        },
        {
          id: 'F',
          nombre: 'Femenino',
        },
      ],
    }),

    prisma.areas_de_formacion.createMany({
      data: [
        { codigo: 'CAS', nombre: 'Castellano' },
        { codigo: 'CIN', nombre: 'Ciencias Naturales' },
        { codigo: 'BIO', nombre: 'Biología' },
        { codigo: 'FIS', nombre: 'Física' },
        { codigo: 'QUI', nombre: 'Química' },
        { codigo: 'CIT', nombre: 'Ciencias De La Tierra' },
        { codigo: 'EDF', nombre: 'Educación Física' },
        { codigo: 'GHC', nombre: 'Geografía, Historia Y Ciudadanía' },
        { codigo: 'MAT', nombre: 'Matemáticas' },
        { codigo: 'OYC', nombre: 'Orientación Y Convivencia' },
        { codigo: 'ART', nombre: 'Arte y Patrimonio' },
        {
          codigo: 'GCR',
          nombre: 'Grupos de Creación, Recreación y Producción',
        },
        { codigo: 'SOB', nombre: 'Formación para la Soberanía Nacional' },
        { codigo: 'ING', nombre: 'Inglés' },
      ],
    }),

    prisma.niveles_academicos.createMany({
      data: NIVELES_ACADEMICOS as any,
    }),

    prisma.pensum.createMany({
      data: [
        { id: 1, nivel_academico: 1, area_de_formacion: 'ART', horas: 4 },
        { id: 2, nivel_academico: 1, area_de_formacion: 'ART', horas: 4 },
        { id: 7, nivel_academico: 4, area_de_formacion: 'CAS', horas: 4 },
        { id: 6, nivel_academico: 3, area_de_formacion: 'CAS', horas: 4 },
        { id: 5, nivel_academico: 2, area_de_formacion: 'CAS', horas: 4 },
        { id: 4, nivel_academico: 1, area_de_formacion: 'CAS', horas: 4 },
        { id: 9, nivel_academico: 1, area_de_formacion: 'CIN', horas: 6 },
        { id: 51, nivel_academico: 4, area_de_formacion: 'GCR', horas: 6 },
        { id: 50, nivel_academico: 3, area_de_formacion: 'GCR', horas: 6 },
        { id: 49, nivel_academico: 2, area_de_formacion: 'GCR', horas: 6 },
        { id: 48, nivel_academico: 1, area_de_formacion: 'GCR', horas: 6 },
        { id: 46, nivel_academico: 4, area_de_formacion: 'OYC', horas: 2 },
        { id: 45, nivel_academico: 3, area_de_formacion: 'OYC', horas: 2 },
        { id: 44, nivel_academico: 2, area_de_formacion: 'OYC', horas: 2 },
        { id: 43, nivel_academico: 1, area_de_formacion: 'OYC', horas: 2 },
        { id: 42, nivel_academico: 5, area_de_formacion: 'MAT', horas: 4 },
        { id: 41, nivel_academico: 4, area_de_formacion: 'MAT', horas: 4 },
        { id: 40, nivel_academico: 3, area_de_formacion: 'MAT', horas: 4 },
        { id: 39, nivel_academico: 2, area_de_formacion: 'MAT', horas: 4 },
        { id: 38, nivel_academico: 1, area_de_formacion: 'MAT', horas: 4 },
        { id: 37, nivel_academico: 5, area_de_formacion: 'ING', horas: 4 },
        { id: 36, nivel_academico: 4, area_de_formacion: 'ING', horas: 6 },
        { id: 35, nivel_academico: 3, area_de_formacion: 'ING', horas: 6 },
        { id: 34, nivel_academico: 2, area_de_formacion: 'ING', horas: 6 },
        { id: 33, nivel_academico: 1, area_de_formacion: 'ING', horas: 6 },
        { id: 32, nivel_academico: 5, area_de_formacion: 'GHC', horas: 4 },
        { id: 31, nivel_academico: 4, area_de_formacion: 'GHC', horas: 4 },
        { id: 30, nivel_academico: 3, area_de_formacion: 'GHC', horas: 6 },
        { id: 29, nivel_academico: 2, area_de_formacion: 'GHC', horas: 6 },
        { id: 28, nivel_academico: 1, area_de_formacion: 'GHC', horas: 6 },
        { id: 27, nivel_academico: 5, area_de_formacion: 'SOB', horas: 2 },
        { id: 26, nivel_academico: 4, area_de_formacion: 'SOB', horas: 2 },
        { id: 25, nivel_academico: 5, area_de_formacion: 'EDF', horas: 6 },
        { id: 24, nivel_academico: 4, area_de_formacion: 'EDF', horas: 6 },
        { id: 23, nivel_academico: 3, area_de_formacion: 'EDF', horas: 6 },
        { id: 22, nivel_academico: 2, area_de_formacion: 'EDF', horas: 6 },
        { id: 21, nivel_academico: 1, area_de_formacion: 'EDF', horas: 6 },
        { id: 20, nivel_academico: 5, area_de_formacion: 'CIT', horas: 2 },
        { id: 19, nivel_academico: 5, area_de_formacion: 'QUI', horas: 4 },
        { id: 18, nivel_academico: 4, area_de_formacion: 'QUI', horas: 4 },
        { id: 17, nivel_academico: 3, area_de_formacion: 'QUI', horas: 4 },
        { id: 16, nivel_academico: 5, area_de_formacion: 'FIS', horas: 4 },
        { id: 15, nivel_academico: 4, area_de_formacion: 'FIS', horas: 4 },
        { id: 14, nivel_academico: 3, area_de_formacion: 'FIS', horas: 4 },
        { id: 13, nivel_academico: 5, area_de_formacion: 'BIO', horas: 4 },
        { id: 12, nivel_academico: 4, area_de_formacion: 'BIO', horas: 4 },
        { id: 11, nivel_academico: 3, area_de_formacion: 'BIO', horas: 4 },
        { id: 10, nivel_academico: 2, area_de_formacion: 'CIN', horas: 6 },
        { id: 8, nivel_academico: 5, area_de_formacion: 'CAS', horas: 4 },
        { id: 52, nivel_academico: 2, area_de_formacion: 'ART', horas: 4 },
        { id: 53, nivel_academico: 5, area_de_formacion: 'OYC', horas: 2 },
        { id: 54, nivel_academico: 5, area_de_formacion: 'GCR', horas: 6 },
      ],
    }),

    prisma.estados_civiles.createMany({
      data: [
        { id: 1, nombre: 'SOLTERO' },
        { id: 2, nombre: 'CASADO' },
        { id: 3, nombre: 'VIUDO' },
        { id: 4, nombre: 'DIVORCIADO' },
      ],
    }),

    prisma.estados.createMany({
      data: [
        { codigo: 'VE-Z', nombre: 'Amazonas' },
        { codigo: 'VE-B', nombre: 'Anzoategui' },
        { codigo: 'VE-C', nombre: 'Apure' },
        { codigo: 'VE-D', nombre: 'Aragua' },
        { codigo: 'VE-E', nombre: 'Barinas' },
        { codigo: 'VE-F', nombre: 'Bolivar' },
        { codigo: 'VE-G', nombre: 'Carabobo' },
        { codigo: 'VE-H', nombre: 'Cojedes' },
        { codigo: 'VE-Y', nombre: 'Delta Amacuro' },
        { codigo: 'VE-A', nombre: 'Distrito Capital' },
        { codigo: 'VE-I', nombre: 'Falcon' },
        { codigo: 'VE-J', nombre: 'Guarico' },
        { codigo: 'VE-X', nombre: 'La Guaira' },
        { codigo: 'VE-K', nombre: 'Lara' },
        { codigo: 'VE-L', nombre: 'Merida' },
        { codigo: 'VE-M', nombre: 'Miranda' },
        { codigo: 'VE-N', nombre: 'Monagas' },
        { codigo: 'VE-O', nombre: 'Nueva Esparta' },
        { codigo: 'VE-P', nombre: 'Portuguesa' },
        { codigo: 'VE-R', nombre: 'Sucre' },
        { codigo: 'VE-S', nombre: 'Tachira' },
        { codigo: 'VE-T', nombre: 'Trujillo' },
        { codigo: 'VE-U', nombre: 'Yaracuy' },
        { codigo: 'VE-V', nombre: 'Zulia' },
      ],
    }),

    prisma.municipios.createMany({
      data: [
        { codigo: 'N-01', nombre: 'Acosta', codigo_estado: 'VE-N' },
        { codigo: 'N-02', nombre: 'Aguasay', codigo_estado: 'VE-N' },
        { codigo: 'N-03', nombre: 'Bolívar', codigo_estado: 'VE-N' },
        { codigo: 'N-04', nombre: 'Caripe', codigo_estado: 'VE-N' },
        { codigo: 'N-05', nombre: 'Cedeño', codigo_estado: 'VE-N' },
        { codigo: 'N-06', nombre: 'Ezequiel Zamora', codigo_estado: 'VE-N' },
        { codigo: 'N-07', nombre: 'Libertador', codigo_estado: 'VE-N' },
        { codigo: 'N-08', nombre: 'Maturín', codigo_estado: 'VE-N' },
        { codigo: 'N-09', nombre: 'Piar', codigo_estado: 'VE-N' },
        { codigo: 'N-10', nombre: 'Punceres', codigo_estado: 'VE-N' },
        { codigo: 'N-11', nombre: 'Santa Bárbara', codigo_estado: 'VE-N' },
        { codigo: 'N-12', nombre: 'Sotillo', codigo_estado: 'VE-N' },
        { codigo: 'N-13', nombre: 'Uracoa', codigo_estado: 'VE-N' },
      ],
    }),

    prisma.parroquias.createMany({
      data: [
        {
          codigo: 'N-08P01',
          nombre: 'Altos De Los Godos',
          codigo_municipio: 'N-08',
        },
        { codigo: 'N-08P02', nombre: 'Boqueron', codigo_municipio: 'N-08' },
        { codigo: 'N-08P03', nombre: 'El Corozo', codigo_municipio: 'N-08' },
        { codigo: 'N-08P04', nombre: 'El Furrial', codigo_municipio: 'N-08' },
        { codigo: 'N-08P05', nombre: 'Jusepin', codigo_municipio: 'N-08' },
        { codigo: 'N-08P06', nombre: 'La Pica', codigo_municipio: 'N-08' },
        { codigo: 'N-08P07', nombre: 'Las Cocuizas', codigo_municipio: 'N-08' },
        { codigo: 'N-08P08', nombre: 'Maturin', codigo_municipio: 'N-08' },
        { codigo: 'N-08P09', nombre: 'San Simon', codigo_municipio: 'N-08' },
        { codigo: 'N-08P10', nombre: 'San Vicente', codigo_municipio: 'N-08' },
        { codigo: 'N-08P11', nombre: 'Santa Cruz', codigo_municipio: 'N-08' },
      ],
    }),

    prisma.centros_de_votacion.createMany({
      data: [
        {
          codigo: 'N-08P08CV01',
          nombre: 'Anexo De La Escuela Básica José Tadeo Monagas',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV02',
          nombre: 'Centro De Votacion Los Arenales',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV03',
          nombre: 'Centro De Votacion Villa Nueva',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV04',
          nombre: 'Centro Educativo Estadal Gigfredo Rios',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV05',
          nombre: 'Complejo Educativo Antonio Jose De Sucre',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV06',
          nombre: 'Complejo Educativo Manuela Sáenz',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV07',
          nombre: 'Complejo Educativo Nacional Agua Negra',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV08',
          nombre: 'Complejo Educativo Nacional Indigena Yabinoko',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV09',
          nombre: 'Escuela Basica Bolivariana El Caruto',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV10',
          nombre: 'Escuela Basica Bolivariana El Respiro',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV11',
          nombre: 'Escuela Basica Concentrada El Pechon',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV12',
          nombre: 'Escuela Basica Concentrada Los Aceites De Guanipa',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV13',
          nombre: 'Escuela Basica El Blanquero',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV14',
          nombre: 'Escuela Basica El Chispero',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV15',
          nombre: 'Escuela Basica Nicolas Lopez',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV16',
          nombre: 'Escuela Básica Bolivariana Curiepe',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV17',
          nombre: 'Escuela Básica José Tadeo Monagas',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV18',
          nombre: 'Escuela Nacional Pericoco De Aribi',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV19',
          nombre: 'Escuela Primaria Caratal Del Tigre',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV20',
          nombre: 'Escuela Primaria Nacional Los Araguaneyes',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV21',
          nombre: 'Unidad Educativa Bolivariana Cecilia Elena Naranja Precilla',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV22',
          nombre: 'Unidad Educativa Bolivariana El Salto De Morichal',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV23',
          nombre: 'Unidad Educativa Bolivariana La Centellita',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV24',
          nombre: 'Unidad Educativa Bolivariana San Jose De Buja',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV25',
          nombre: 'Unidad Educativa Bolivariana Santa Barbara De Sotillo',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV26',
          nombre: 'Unidad Educativa El Silencio De Morichal Largo',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV27',
          nombre: 'Unidad Educativa Estadal  Los Pozos De Guanipa',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV28',
          nombre: 'Unidad Educativa La Puente De Agua Negra',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV29',
          nombre: 'Unidad Educativa Maria Teresa Rodríguez Del Toro',
          codigo_parroquia: 'N-08P08',
        },
        {
          codigo: 'N-08P08CV30',
          nombre: 'Unidad Educatva Rafael Celestino Arriojas',
          codigo_parroquia: 'N-08P08',
        },
      ],
    }),

    prisma.planteles_educativos.createMany({
      data: [
        {
          dea: 'OD08111613',
          nombre: 'Cib Las Piedritas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1213D1613',
          nombre: 'Ue Idelfonso Donner',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05081613',
          nombre: 'Eb U 420 El Paraiso de Guara',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05101613',
          nombre: 'E. B. Unitaria Numero 331',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05111613',
          nombre: 'E. B. Unitaria Numero 329 Chaguaramas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05131613',
          nombre: 'Esc Bas Unit N 324 San Felix',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05141613',
          nombre: 'E. B. B Guaritas Numero 149 323 413',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05151613',
          nombre: 'E. B. B 318 319 Varadero de Manamo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05161613',
          nombre: 'E. B. E. U 425 Las Piedritas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05171613',
          nombre: 'Escuela Est Unit Numero 422 Aguas Dulces',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07161613',
          nombre: 'E. B. B Luis Beltran Prieto Figueroa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08031613',
          nombre: 'C. E. I. Andrés Bello',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05041613',
          nombre: 'E. B. Unit N 327 Los Pilones',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05051613',
          nombre: 'U. E. N. Paso Nuevo',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD08241612', nombre: 'Ebi Marusa', zona_educativa: 'VE-N' },
        {
          dea: 'OD09461612',
          nombre: 'E. B. Los Barrancos de Fajardo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1377D1612',
          nombre: 'L N Alarico Gomez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02171612',
          nombre: 'E. B. B Mata Gorda Numero 69 1007',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01901613',
          nombre: 'P. E.. B. Olivariano Lomas Del Viento',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01911613',
          nombre: 'P. E.. B. Olivariano Chaimas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02591613',
          nombre: 'E. B. B Chaimas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05031613',
          nombre: 'E. B. Unitaria Numero 336 San Francisco',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05261612',
          nombre: 'E. B. Florentino Montero Arias',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD05711612', nombre: 'E. B. Uriapara', zona_educativa: 'VE-N' },
        {
          dea: 'PD00521612',
          nombre: 'U. E. C P Colegio Catolico Jesus Maestro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0811D1612',
          nombre: 'L B Eloy Palacios Cabello',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01851612',
          nombre: 'E. B. C Numero 320 419 Varadero de Limon',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05301612',
          nombre: 'E. B. U Numero 417 Punta de Piedra de San Roque',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05341612',
          nombre: 'E. B. U Numero 415 Uverito',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05351612',
          nombre: 'Escuela Unit Numero 302 Cafetera de Coloradito',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3255D1610',
          nombre: 'U. E. Libertador Bolivar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3390D1610',
          nombre: 'L B Juana Ramirez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05001611',
          nombre: 'E. B. B Juan VicentE. B. Olivar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1558D1611',
          nombre: 'L N Benjamin Briceño Marten',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02371612',
          nombre: 'P. E.. B. Olivariano Uriapara',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05201612',
          nombre: 'E. B. Blanca Guevara DE. B. Alan',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04901610',
          nombre: 'E. B. Rafael Urdaneta',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04921610',
          nombre: 'U. E. B. El Danto Ner 101',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04991610',
          nombre: 'U. E. B. Simón Rodriguez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3087D1610',
          nombre: 'U. E. Maturin Azagua',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3831D1609',
          nombre: 'U. E. Olga Betancourt de Pérez Taguaya',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04771610',
          nombre: 'U. E. C Nro 47 82 334 505 E. B. B Pte Puncere',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04911610',
          nombre: 'U. E. B. Sabana de Cachipo Nro 57 495',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3837D1610',
          nombre: 'E. B. Leonardo Ruiz Pineda',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4643D1610',
          nombre: 'L B Antonio José de Sucre Antigua Andrés Eloy Blanco',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04781610',
          nombre: 'E. B. C Los Baños Numero 156',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04831610',
          nombre: 'U. E. B. Nro 62 La Placa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04861610',
          nombre: 'E. B. El Limon Numero 54 62 Ner N101',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07051609',
          nombre: 'L B Juana Ramirez Creacion Ii',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04581609',
          nombre: 'Unidad Educativa Las Canoas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3213D1609',
          nombre: 'Liceo Nacional Manuel Hernandez Rocca',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04711609',
          nombre: 'U. E. Bocas de Rio Chiquito',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09651609',
          nombre: 'Liceo Nacional José Francisco Bermudez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3833D1609',
          nombre: 'U. E. Rio Chiquito Cirilo Marquez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06751609',
          nombre: 'U. E. N. Francisco de Miranda',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06981609',
          nombre: 'E. B. B Mangos de Orocual',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07381609',
          nombre: 'U. E. Teresa Carreño',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3053D1609',
          nombre: 'U. E. Cayetano Farias Villarroel',
          zona_educativa: 'VE-N',
        },
        { dea: 'T4708D1609', nombre: 'E T A R Aragua', zona_educativa: 'VE-N' },
        {
          dea: 'OD00601609',
          nombre: 'U. E. B. Chaparral',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04651609',
          nombre: 'Unidad Educativa Leonardo Infante Ner 162',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06401609',
          nombre: 'Ner 162 E. B. C Numero 288 506 Los Pozos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09221608',
          nombre: 'C N F Juana Ramirez Ii',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4632D1608',
          nombre: 'L B San Vicente Ferrer',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09001608',
          nombre: 'U. E. N. Las Carolinas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3864D1609',
          nombre: 'U. E. Matias Nuñez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02001609',
          nombre: 'E. B. Aniceto Guevara Vega',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0937D1609',
          nombre: 'Liceo Nacional Felix Antonio Calderon',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00081608',
          nombre: 'U. E. San Pablo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00811608',
          nombre: 'U. E. José Tadeo Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD01061608',
          nombre: 'U. E. Jean Firmin',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD07361608',
          nombre: 'U. E. C P Cecilio Acosta Iv',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD07731608',
          nombre: 'C . E. I. Santa Maria',
          zona_educativa: 'VE-N',
        },
        { dea: 'PD10061608', nombre: 'Indio Maturin', zona_educativa: 'VE-N' },
        {
          dea: 'S1803D1608',
          nombre: 'Liceo Nacional Diego Sifontes Sosa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01251608',
          nombre: 'E. B. B Ismael Salazar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02141608',
          nombre: 'J I Bolivariano Ismael Salazar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06201608',
          nombre: 'U. E. B. Pueblo Libre',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01321608',
          nombre: 'Grupo Escolar Caripe',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06251608',
          nombre: 'E. B. Dra Carmen Evelia Douglas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06271608',
          nombre: 'Eein La Llovizna',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06361608',
          nombre: 'E. B. B Castor Guevara',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08201608',
          nombre: 'C. E. I. Samuel Robinson',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08271608',
          nombre: 'Preescolar Coordinados Cantv',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08781608',
          nombre: 'C. E. I. Brisas Del Sol',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08831608',
          nombre: 'U. E. Unidad Educativa Padre Juan Vives Suria',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09321608',
          nombre: 'U. E. Las Garzas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09471608',
          nombre: 'Escuela Inicial Nacional Belen Sanjuan',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'T0113D1608',
          nombre: 'E T A P. E. Loy Palacios Cabello',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'T0181D1608',
          nombre: 'L B Ildefonso Nuñez Mares',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00261608',
          nombre: 'U. E. Niño Jesus',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00541608',
          nombre: 'J I B Bolivariano Caripe',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD00551608', nombre: 'P. E. La Cruz', zona_educativa: 'VE-N' },
        { dea: 'OD01171608', nombre: 'Eb San Jaime', zona_educativa: 'VE-N' },
        {
          dea: 'PD09561608',
          nombre: 'C. E. I. Abuelo Eugenio Mendoza',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0346D1608',
          nombre: 'L N B Francisco Isnardi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0347D1608',
          nombre: 'L N B Miguel José Sanz',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0352D1608',
          nombre: 'U. E. C P Maturin',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0691D1608',
          nombre: 'U. E. Marco Antonio Saluzzo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1212D1608',
          nombre: 'U. E. Dr Manuel Nuñez Tovar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1378D1608',
          nombre: 'E T R C Felix Angel Losada',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3742D1608',
          nombre: 'U. E. C A Dr Braulio Pérez Marcio',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3744D1608',
          nombre: 'U. E. P Cecilio Acosta',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3842D1608',
          nombre: 'Escuela Básica María Teresa Del Toro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD05661608',
          nombre: 'U. E. P Corazon de Jesus',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD06151608',
          nombre: 'U. E. Francisco Lazo Marti',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD07781608',
          nombre: 'U. E. Bolivariana Doctor Arturo Uslar Prieti',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD07841608',
          nombre: 'U. E. Los Ilustres',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD08081608',
          nombre: 'U. E. Metropolitana Isabel La Catolica',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD09521608',
          nombre: 'U. E. Nuestra Senora DE. B. Etania',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00951608',
          nombre: 'U. E. C P Santa Martha',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD01001608',
          nombre: 'U. E. Rafael María Baralt',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00041608',
          nombre: 'U. E. C. E Jean Piaget',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00061608',
          nombre: 'U. E. C P Dr Luis Beltran Prieto Figueroa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00151608',
          nombre: 'U. E. C P Fermin Toro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00241608',
          nombre: 'U. E. I. Nuevos Horizontes',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00471608',
          nombre: 'U. E. I. P San Maturin',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00491608',
          nombre: 'U. E. Divino Niño Jesus',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00791608',
          nombre: 'U. E. Oasis DE. B. Endicion',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00831608',
          nombre: 'U. E. C P Augusto Mijares',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09121608',
          nombre: 'C. E. I. Simoncito Santa Ines',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD10151608',
          nombre: 'C. E. I. José Damian Ramirez Labrador',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04301608',
          nombre: 'Escuela Inicial Nacional Alto Guri',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04411608',
          nombre: 'J I B Republica de Uruguay',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD04511608', nombre: 'J I B Boyaca', zona_educativa: 'VE-N' },
        {
          dea: 'OD05491608',
          nombre: 'P. E.. B. Olivariano Paula Bastardo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05531608',
          nombre: 'Escuela Primaria Nacional Juan Francisco Mila de La Roca',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05551608',
          nombre: 'E. B. B Paula Bastardo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05671608',
          nombre:
            'Escuela Básica y Centro de Educacion Inicial Rosa Adela de Hernandez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05931608',
          nombre: 'J I Negra Hipolita',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07771608',
          nombre: 'L N B Dr Jesus Rafael Zambrano',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07891608',
          nombre: 'C. E. I. Irma Saez Merida de Grisanti',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02041608',
          nombre: 'P. E.. B. Olivariano Isabel Padrino de Campos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02261608',
          nombre: 'P. E.. B. Olivariano Ventura Vargas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00761608',
          nombre: 'C P. E.. B. El Libertador',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01071608',
          nombre: 'J I Felix A Calderon',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01801608',
          nombre: 'Grupo Escolar Republica de Uruguay',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD01871608', nombre: 'E. B. Boyaca', zona_educativa: 'VE-N' },
        {
          dea: 'OD02281608',
          nombre: 'E. B. Vicente Salias',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02351608',
          nombre: 'E. B. Marcos Serres Padilla',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1943D1608',
          nombre: 'E. B. B Simón Rodriguez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3472D1608',
          nombre: 'E. B. Leonardo Infante',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3829D1608',
          nombre: 'E. B. Primero de Mayo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4709D1608',
          nombre: 'U. E. Creacion El Parquesito',
          zona_educativa: 'VE-N',
        },
        { dea: 'T0114D1608', nombre: 'E T I Maturin', zona_educativa: 'VE-N' },
        {
          dea: 'OD00251608',
          nombre: 'J I Paula Bastardo Brito',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0938D1608',
          nombre: 'Liceo Nacional Luis Padrino',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1477D1608',
          nombre: 'Liceo Bolivariano Rafael María Peña Saavedra',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1478D1608',
          nombre: 'E T A R Libertador Simón Bolivar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1556D1608',
          nombre: 'U. E. Gregorio Rondon',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00981608',
          nombre: 'U. E. Dr Gustavo Herrera',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD06261608',
          nombre: 'U. E. Academia Evangelica de Venezuela',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD07281608',
          nombre: 'U. E. Centro Educativo Las Americas',
          zona_educativa: 'VE-N',
        },
        { dea: 'PD08411608', nombre: 'U. E. Urimare', zona_educativa: 'VE-N' },
        {
          dea: 'PD09531608',
          nombre: 'C . E. I. La Edad de Oro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD09551608',
          nombre: 'E. B. Manaure S C',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD09661608',
          nombre: 'Colegio Privado El Valle',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD09871608',
          nombre: 'Colegio Privado Canaima',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD09881608',
          nombre: 'U. E. Salvador Garmendia',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD09971608',
          nombre: 'Alfa y Omega Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00661608',
          nombre: 'U. E. Angel de La Guarda Fe y Alegria',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00921608',
          nombre: 'U. E. Morichal Largo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09671608',
          nombre: 'C E N General Ezequiel Zamora',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09771608',
          nombre: 'L N General Juan German Roscio Nieves',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD10201608', nombre: 'Pedro Camejo', zona_educativa: 'VE-N' },
        {
          dea: 'PD00211608',
          nombre: 'U. E. C P A Dios Sea La Gloria',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00271608',
          nombre: 'Unidad Educativa Padre Claret',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00501608',
          nombre: 'E. B. San Ignacio de Loyola',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00581608',
          nombre: 'U. E. Santa Ana',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00611608',
          nombre: 'I F I R Cantalicio',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07711608',
          nombre: 'J I Cecilio Acosta',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07961608',
          nombre: 'Cnf Bolivariano Santa Elena',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08141608',
          nombre: 'E. B. Dr Ernesto Che Guevara',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08231608',
          nombre: 'Eb 4 de Febrero',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD08261608', nombre: 'Eb Santa Ines', zona_educativa: 'VE-N' },
        {
          dea: 'OD08601608',
          nombre: 'Cnf Simoncito Chacao',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08891608',
          nombre: 'Cnf Simoncito Las Acacias',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09021608',
          nombre: 'E P B Danilo Anderson',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07241608',
          nombre: 'U. E. Talento Deportivo Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07701608',
          nombre: 'U. E. Pablo Neruda',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06091608',
          nombre: 'E. B. Pablo Emilio Castillo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06941608',
          nombre: 'C A S I Mi 2 Hogar Mereyal',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01181608',
          nombre: 'U. E. Jesus de Nazareth',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01581608',
          nombre: 'J I B Pedro Maximo Campos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01731608',
          nombre: 'J I Las Cocuizas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02201608',
          nombre: 'J I Pablo Emilio Castillo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05381608',
          nombre: 'P. E.. B. Olivariano Luisa Caceres de Arismendi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05421608',
          nombre: 'E. B. B Maximo Campos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05801608',
          nombre: 'C P Doña Menca de Leoni',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD06041608', nombre: 'J I Guarapiche', zona_educativa: 'VE-N' },
        {
          dea: 'OD06711608',
          nombre: 'U. E. La Esperanza',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06721608',
          nombre: 'U. E. La Hormiga',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06731608',
          nombre: 'Escuela Bolivariana El Barril',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09191608',
          nombre: 'E P Felix Angel Lozada',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1591D1608',
          nombre: 'Liceo Bolivariano Felix Angel Lozada',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4298D1608',
          nombre: 'Liceo Bolivariano José Felix Ribas',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD00271608', nombre: 'E. B. Mereyal', zona_educativa: 'VE-N' },
        {
          dea: 'OD00481608',
          nombre: 'E. B. Cecilio Acosta',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06691608',
          nombre: 'U. E. Fanny Centeno',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06701608',
          nombre: 'U. E. La Locacion',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4596D1608',
          nombre: 'E. B. Roberto Gomez Dofourt',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06321608',
          nombre: 'E. B. C Numero 169 343 418 512 Barrancas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06391608',
          nombre: 'E. B. 232 La Linea',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06611609',
          nombre: 'E. B. El Caituco',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08801608',
          nombre: 'C N F Simoncito San Jose',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00671608',
          nombre: 'U. E. Anatilde Salcedo Fe y Alegria',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0939D1608',
          nombre: 'U. E. Manuel P Maneiro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02331608',
          nombre: 'J I Felix Angel Lozada',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07941608',
          nombre: 'C. E. I. Simoncito José Gregorio Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08541608',
          nombre: 'Escuela Bolivariana Camilo Villanueva',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD10071608', nombre: 'Cesar Rengifo', zona_educativa: 'VE-N' },
        {
          dea: 'OD07491608',
          nombre: 'E. B. Rafael María Baralt',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07621608',
          nombre: 'E. B. B Felicia Rondon de Cabello',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07741608',
          nombre: 'U. E. Creacion La Candelaria',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09331608',
          nombre: 'C . E. I. Julio Camino',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1555D1608',
          nombre: 'L B Creacion El Furrial',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05371608',
          nombre: 'Ner 250 E. B. C B 184 572 Amarilis',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07271608',
          nombre: 'U. E. Salvador Medina Prado',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09401608',
          nombre: 'Escuela Primaria Cano Del Medio',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09691608',
          nombre: 'E P. E. L Tiestero de Aribi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD10111608',
          nombre: 'Antonio José de Sucre',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1941D1607',
          nombre: 'U. E. Simón Bolivar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3042D1608',
          nombre: 'U. E. Antonio José de Sucre',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3050D1608',
          nombre: 'U. E. Nicolas Lopez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3836D1608',
          nombre: 'L B José Tadeo Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3838D1608',
          nombre: 'Unidad Educativa Joaquin Del Tigre Gigfredo Rios',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3841D1608',
          nombre: 'U. E. El Silencio',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4711D1608',
          nombre: 'U. E. El Blanquero',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06601608',
          nombre: 'Unidad Educativa Cecilia Elena Naranjo Presilla',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06631608',
          nombre: 'Ner 250 U. E. C Numero 72 255 455 Altamira',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06641608',
          nombre: 'E. B. Oficial Combinada Mulaticos Manuela Saenz',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07481608',
          nombre: 'U. E. B. I Warao Gran Cacique',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06491608',
          nombre: 'E. B. U Numero 182 La Sarrapia',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06531608',
          nombre: 'E. B. Los Aceites de Guanipa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06541608',
          nombre: 'U. E. El Respiro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06561608',
          nombre: 'E. B. B Pericoco de Aribi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06571608',
          nombre: 'E. B. C El Maitero',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06591608',
          nombre: 'Unidad Educativa Bolivariana El Salto de Morichal Largo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05511608',
          nombre: 'Ner 250E. B. C B Numero 102 156 Curiepe',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05571608',
          nombre: 'E. B. U Numero 192 Carapal Del Tigre',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06331608',
          nombre: 'E P. E. La Union de Morichal Largo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06411608',
          nombre: 'U. E. San José DE. B. Uja',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06421608',
          nombre: 'Ner 250 E. B. U B Los Araguaneyes Ner',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD06431608', nombre: 'E. B. Parare', zona_educativa: 'VE-N' },
        {
          dea: 'OD06441608',
          nombre: 'Unidad Educativa Rafael Celestino Arrioja',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06451608',
          nombre: 'U. E. Monte Oscuro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06471608',
          nombre: 'E. B. El Pechon',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06481608',
          nombre: 'E. B. U Numero 154 Caratal Del Tigre',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S2169D1608',
          nombre: 'L B Simón Bolivar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S2198D1608',
          nombre: 'U. E. Instituto Educativo Alejandro de Humbolt',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3047D1608',
          nombre: 'U. E. Luisa Jimenez de Canelon',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3807D1608',
          nombre: 'Liceo Nacional El Costo',
          zona_educativa: 'VE-N',
        },
        { dea: 'S3839D1608', nombre: 'U. E. Guayabal', zona_educativa: 'VE-N' },
        {
          dea: 'S4644D1608',
          nombre: 'U. E. Carmen de Milano',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4704D1608',
          nombre: 'E. B. La Sabana Del Zorro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00421608',
          nombre: 'E. B. B Nacional Concentrada Agua Negra',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01081608',
          nombre: 'U. E. Santa Barbara',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01271608',
          nombre: 'E. B. C Numero 437 La Puente de Agua Negra',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09511608',
          nombre: 'E. B. Andrés Bello Costo Arriba',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00631608',
          nombre: 'Instituto Moderno de Educacion Integral Imein Ca',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00971608',
          nombre: 'Guarderia Preescolar Chiqui Kids',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD07651608',
          nombre: 'U. E. Escuela Hogar Virgen Misionera de La Esperanza',
          zona_educativa: 'VE-N',
        },
        { dea: 'PD10081608', nombre: '5 de Julio', zona_educativa: 'VE-N' },
        { dea: 'PD10121608', nombre: 'Teresa Carreño', zona_educativa: 'VE-N' },
        {
          dea: 'OD06671608',
          nombre: 'U. E. 76 358 481 Sta Elena de Viboral',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08501608',
          nombre: 'L B Salvador Allende',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08521608',
          nombre: 'UE. B. Olivariana José de San Martin',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08941608',
          nombre: 'C. E. I. Simoncito Aquiles Nazoa',
          zona_educativa: 'VE-N',
        },
        { dea: 'S4624D1608', nombre: 'U. E. Bolivar', zona_educativa: 'VE-N' },
        {
          dea: 'S4645D1608',
          nombre: 'E. B. Marlene Sequea de C Alto Paramaconi Ii',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4721D1608',
          nombre: 'E. B. Alto Paramaconi I',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00281608',
          nombre: 'E. B. Dr Luis Beltran Prieto Figueroa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02381608',
          nombre: 'Escuela Granja Virgen Del Valle',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04451608',
          nombre: 'U. E. Luisa Beltrana de Figueroa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05461608',
          nombre: 'E. B. Doña Menca de Leoni',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06101608',
          nombre: 'U. E. La Sarrapia',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06341608',
          nombre: 'E. B. Numero 298 573 Paradero',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06351608',
          nombre: 'E. B. C 186 243 258 Rincon Del Costo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4296D1608',
          nombre: 'Liceo Nacional Los Guaritos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4594D1608',
          nombre: 'E. B. La Puente',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1376D1608',
          nombre: 'Liceo Nacional Felix Armando Nunez Beauperthuy',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1739D1608',
          nombre: 'Liceo Nacional Creacion Iv',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S2170D1608',
          nombre: 'U. E. Victoria Ramirez Molinos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S2671D1608',
          nombre: 'U. E. Mario Briceño Iragorry',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3471D1608',
          nombre: 'U. E. Padre Luis Antonio Ormieres',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3616D1608',
          nombre: 'U. E. Francisco Verde',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3806D1608',
          nombre: 'Unidad Educativa José Angel Meza Verde',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3828D1608',
          nombre: 'U. E. Antonio José de Sucre',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09601608',
          nombre: 'Escuela Primaria Nacional Cacique Guanaguanai',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09641608',
          nombre: 'Liceo Nacional Batalla de La Victoria',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD10101608',
          nombre: 'Hugo Rafael Chavez Frias',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD10161608', nombre: 'Morichal', zona_educativa: 'VE-N' },
        {
          dea: 'PD00161608',
          nombre: 'U. E. Dr José Gil Fortoul',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00701608',
          nombre: 'U. E. Colegio Cristiano Cristo Rey',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD01091608',
          nombre: 'U. E. Integral Virgen Del Valle',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD01341608',
          nombre: 'Escuela Experimental Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09291608',
          nombre: 'L B Hernan Pineda',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09451608',
          nombre: 'Escuela Primaria Nacional Bolivar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08721608',
          nombre: 'Escuela de Educ Inicial Nac Francisco de Miranda',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08731608',
          nombre: 'Centro de Educacion Simoncito Los Guaros',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08741608',
          nombre: 'Cnf Simoncito Bellos Horizontes',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08791608',
          nombre: 'Cnf Alto Paramaconi Ii',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09051608',
          nombre: 'C N F San Judas Tadeo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09101608',
          nombre: 'C . E. I. Centro Del Niño y La Familia Brisas de La Cascada',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08571608',
          nombre: 'C N F Simoncito Moscu',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08581608',
          nombre: 'Cnf Simoncito Campo Ayacucho',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08641608',
          nombre: 'C N F Villa Heroica',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08711608',
          nombre: 'C . E. I. B Simonsito Centro Paramaconi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02341608',
          nombre: 'J I Los Guaritos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04401608',
          nombre: 'J I José Tadeo Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05451608',
          nombre: 'E P B Adriana Rengel de Sequera',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07141608',
          nombre: 'C N F José María Vargas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07721608',
          nombre: 'C . E. I. Alto de Los Godos 2',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07931608',
          nombre: 'E. B. Ali Primera',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08121608',
          nombre: 'Liceo Bolivariano Gilda Ramirez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08181608',
          nombre: 'Eb Prados Del Sur',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08191608',
          nombre: 'E. B. Batalla de Los Godos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08471608',
          nombre: 'Cnf Simoncito Prado Del Sur',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01771608',
          nombre: 'J I Francisco Verde',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02151608',
          nombre: 'E. B. San Simon',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00391608',
          nombre: 'U. E. B. Colinas de Paramaconi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00531608',
          nombre: 'C . E. I. S Alto Paramaconi Ii',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00561608',
          nombre: 'E. B. B Dr Arturo Uslar Prieti',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00721608',
          nombre: 'E. B. B Miguel Eduardo Turmero',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1089D1607',
          nombre: 'U. E. Ramon Pierluissi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3016D1607',
          nombre: 'E. B. Dora Romero Avila',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01471607',
          nombre: 'E. B. San Simón Ner 330 322',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01511607',
          nombre: 'Escuelabas San José Del Yabo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4641D1607',
          nombre: 'E T A R Forestal Chaguaramas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4705D1607',
          nombre: 'U. E. Chaguaramas',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD07371607', nombre: 'U. E. B. Yarua', zona_educativa: 'VE-N' },
        { dea: 'S4523D1607', nombre: 'U. E. Yarua', zona_educativa: 'VE-N' },
        {
          dea: 'OD04491607',
          nombre: 'U. E. Boca de Uracoa 2562 2563 460',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3834D1607',
          nombre: 'U. E. Ysabel de Verde Ortega',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00221607',
          nombre: 'U. E. C P Jesus de Nazareth',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD01441607',
          nombre: 'U. E. C P San Jose',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04431607',
          nombre: 'Escuela Básica Creacion Inavi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04461607',
          nombre: 'J I Andrés Eloy Blanco',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04531607',
          nombre: 'J I Ismenia Roque de Moya',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04541607',
          nombre: 'Eb Libertador Bolivar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05731607',
          nombre: 'J I Simón Rodriguez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD07361607',
          nombre: 'E. B. Antonio Guzman Blanco',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1476D1606',
          nombre: 'U. E. Creacion El Tejero',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4712D1606',
          nombre: 'U. E. Luis Beltran Prieto Figueroa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00991607',
          nombre: 'J I Concepcion Aleman de Nuñez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01201607',
          nombre: 'Pre Escolar Balbo Bianchini',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01211607',
          nombre: 'J I Juana Bejarano',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01221607',
          nombre: 'J I Simón Bolivar',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD01241607', nombre: 'J I Temblador', zona_educativa: 'VE-N' },
        {
          dea: 'OD01491607',
          nombre: 'E. B. Mata de Venado',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01541607',
          nombre: 'E. B. Carmen de Piamo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01561607',
          nombre: 'Pre Escolar Carmen Padron',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S2804D1606',
          nombre: 'Liceo Nacional Ezequiel Zamora',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3021D1606',
          nombre: 'L B José Gregorio Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4716D1606',
          nombre: 'U. E. Virgen Del Valle',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00951606',
          nombre: 'E. B. Tejero Ii',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08211606',
          nombre: 'Ji Sagrado Corazon de Jesus',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD04471606',
          nombre: 'U. E. Santa Barbara',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD04591606',
          nombre: 'U. E. Carmen Graciela Figuera DE. B. Astardo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD08161606',
          nombre: 'Colegio Privado San Sebastian',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD10131606',
          nombre: 'General Diego Ibarra',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0734N1606',
          nombre: 'U. E. A José Gregorio Monagas Nocturno',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04151606',
          nombre: 'E. B. Ilapeca Numero 359',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04251606',
          nombre: 'L B General Rafael Urdaneta',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04291606',
          nombre: 'J I Ezequiel Zamora',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04301606',
          nombre: 'U. E. B. Don Andrés Bello',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04391606',
          nombre: 'E. B. Francisco de Miranda',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09011606',
          nombre: 'L B Maestro Simón Rodriguez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09041606',
          nombre: 'C . E. I. Teresa de La Parra',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD00141606',
          nombre: 'U. E. Cayetano Farias Villarroel',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD02471606',
          nombre: 'Unidad Educativa Privada Nuestra Santa Patrona',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD04481606',
          nombre: 'C P Nuestra Sra de Lourdes',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01721606',
          nombre: 'E. B. 18 de Mayo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03901606',
          nombre: 'E. B. B La Dominga',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04201605',
          nombre: 'E. B. U La Llanera',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3538D1605',
          nombre: 'U. E. Consuelo Navas Tovar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02181605',
          nombre: 'J I Idelfonzo Nuñez Mares',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD05671605',
          nombre: 'E. B. B Ildefonso Nuñez Mares',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1559D1605',
          nombre: 'U. E. Ildelfonso Nuñez Mares',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00941606',
          nombre: 'U. E. 19 de Abril',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01401606',
          nombre: 'E. B. B Centurion',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01571606',
          nombre: 'U. E. Rafael Villavicencio',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03841605',
          nombre: 'E. B. B José Francisco Bermudez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03861605',
          nombre: 'E. B. B Alto de Potrerito Maestro Jesãƒâ„¢S de Nazareth',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0618D1605',
          nombre: 'Liceo Bolivariano Juan Francisco Mila de La Roca',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4706D1605',
          nombre: 'U. E. Potrerito',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04101605',
          nombre: 'E. B. C Guarapiche Numero 30 357 470',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04111605',
          nombre: 'E. B. Carmen Chacon de Sifontes Quebrada Seca',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4710D1604',
          nombre: 'L B San Agustin',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD00781604', nombre: 'E P B Caripito', zona_educativa: 'VE-N' },
        {
          dea: 'OD01041604',
          nombre: 'E. B. Ligia de Pinto',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01051604',
          nombre: 'E. B. B Potrero de Teresen',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01061604',
          nombre: 'E G B General Ezequiel Zamora',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03371604',
          nombre: 'Ner 100 Ebc La Florida',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03581604',
          nombre: 'Ner 100 Ebu Numero 111 El Aguacate',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03631604',
          nombre: 'Ner 100 Ebu Num 117 Los Cigarrones',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08071604',
          nombre: 'J I Semillero Bolivariano',
          zona_educativa: 'VE-N',
        },
        { dea: 'S4642D1604', nombre: 'L N Teresen', zona_educativa: 'VE-N' },
        {
          dea: 'OD03661604',
          nombre: 'U. E. Ramona Rocca de Lopez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03761604',
          nombre: 'Ner 345 Ebu 115 Las Cinco Cruces',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04081604',
          nombre: 'Ner 345 Ebu 1651 Antonia Margarita Veliz Corozal',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04231604',
          nombre: 'Ner 345 Ebb 1654 Monagal',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD09811604', nombre: 'Juasjuillar', zona_educativa: 'VE-N' },
        {
          dea: 'S4701D1604',
          nombre: 'U. E. N. Alto de Monagal',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD04241604',
          nombre: 'Ner 345 Ebu 2505 La Tacarigua',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00661604',
          nombre: 'U. E. B. Dr Rafael Marsiglia',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03551604',
          nombre: 'Ner 345 Ebb El Banqueado',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03711604',
          nombre: 'C P Alejandro de Humbltd',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03361604',
          nombre: 'Ner 100 Ebb 254 1653 3567 La Peña',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03511604',
          nombre: 'Ner 345 EbU. E. L Sitio Eb José Llovera',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03421604',
          nombre: 'E. B. Edmundo Romero',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03721604',
          nombre: 'C P. E. Idelfonso Nuñez Mares',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'PD09681604',
          nombre: 'U. E. P Niño Rey',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0349D1604',
          nombre: 'L B Dr Julian Padron',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1942D1604',
          nombre: 'L N Miguel Vecchio Marsiglia',
          zona_educativa: 'VE-N',
        },
        { dea: 'S2290D1604', nombre: 'E T A Caripe', zona_educativa: 'VE-N' },
        {
          dea: 'S4177D1604',
          nombre: 'U. E. Martha Vecchio',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02531604',
          nombre: 'E. B. B El Guacharo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0348D1603',
          nombre: 'Liceo Nacional José Tadeo Monagas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1620D1603',
          nombre: 'U. E. Francisco de Miranda',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3045D1603',
          nombre: 'L B José Gil Fortoul',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S3832D1603',
          nombre: 'Escuela Tecnica Nacional Rio Caripe',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00621604',
          nombre: 'U. E. B. Abrahan Lincoln',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03301604',
          nombre: 'C P. E. Legion Bolivariana J I La Frontera',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03311604',
          nombre: 'J I Elena Pérez de Mata',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03321604',
          nombre: 'J de I Concha de Coco',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03231603',
          nombre: 'P. E.. B. Olivariano Pedro Gual',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD06621603',
          nombre: 'E. B. Lisandro Alvarado',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03071603',
          nombre: 'E. B. Est Conc Numero 163 384 Bajo Caripe',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03081603',
          nombre: 'E. B. Andrés Bello Tuberia',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03091603',
          nombre: 'E. B. C Francisco de Miranda Km 9',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03101603',
          nombre: 'E. B. B Simón Rodriguez Las Parcelas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03121603',
          nombre: 'E. B. Audencio Diaz Febres Las Colinas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03131603',
          nombre: 'E. B. Unit N0 3352 La Pega',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03161603',
          nombre:
            'E. B. C Nro 3 39 427 269 Luis Beltran Prieto Figueroa Los Cerritos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03181603',
          nombre: 'E. B. Josefina de Fierro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03191603',
          nombre: 'E. B. B Manuelita Saenz Los Morros',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03211603',
          nombre: 'E. B. B Libertador Simón Bolivar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01791603',
          nombre: 'E. B. Ciudad de Los Teques',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02821603',
          nombre: 'P. E.. B. Olivariano Adelaida Nuñez Sucre',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02981603',
          nombre: 'E. B. Valmore Rodriguez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD03031603',
          nombre: 'E. B. B Rafael Urdaneta Km 8',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09581602',
          nombre: 'Ep Las Piedritas de Aribi',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S1557D1602',
          nombre: 'U. E. Antonio Ciliberto Perez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'T4715D1602',
          nombre: 'E T A Oritupano',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00201603',
          nombre: 'U. E. Udon Perez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01351603',
          nombre: 'L B Indigena Mosu',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01781603',
          nombre: 'E. B. E. B. Romulo Gallegos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02911602',
          nombre: 'Escuela Bas Nro 215 249 El Caro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02921602',
          nombre: 'E. B. N. Conc Nro 1645 La Pulvia',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02931602',
          nombre: 'E. B. Unit El Crucero Del Caro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02941602',
          nombre: 'E. B. U No 211 Arenal',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02951602',
          nombre: 'E. B. C Nro 266 471 Arenal Ii',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02971602',
          nombre: 'E. B. C Nro 158 170 Bocas de Tonoro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02991602',
          nombre: 'E. B. B Oritupano',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD06171602', nombre: 'J I Aguasay', zona_educativa: 'VE-N' },
        {
          dea: 'OD02831602',
          nombre: 'E. B. B Las Gaviotas',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02841602',
          nombre: 'Esc Bas N 214 San José Del ñato',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02851602',
          nombre: 'E. B. Conc Nac 218 159 Periquito',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02861602',
          nombre: 'Escuela Unitaria No 515 Los Conucos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02871602',
          nombre: 'Escuela Concentrada Básica No 13 157 La Inglesa',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02881602',
          nombre: 'E. B. Unitaria No 381 La Madera',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02891602',
          nombre: 'E. B. U Rural No 231Mata de Los Ranchos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02901602',
          nombre: 'Escuela Bas Nac Conc 248 La Florida',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02541602',
          nombre: 'U. E. Fe y Alegria',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD02551602', nombre: 'L B El Piñal', zona_educativa: 'VE-N' },
        {
          dea: 'OD02761601',
          nombre: 'E. B. C Numero 16 19 24 167 438 Miraflores',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02771601',
          nombre: 'E. B. B 621 Guarapiche',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02781601',
          nombre: 'E. B. Numero 14 393 Cerro Negro',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD08971601', nombre: 'El Pao', zona_educativa: 'VE-N' },
        {
          dea: 'OD08981601',
          nombre: 'El Palmar DE. B. Rito',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09421601',
          nombre: 'L B San Francisco',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD00961602',
          nombre: 'U. E. B. Indigena El Guamo',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01391602',
          nombre: 'E. B. Unitaria El Cedral',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01861602',
          nombre: 'E. B. Antonio Ciliberto Perez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02131602',
          nombre: 'E. B. C No 217 259 U. E. B. Altamira',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02721601',
          nombre: 'E. B. Numero 0 2 35 387 488 Triste',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02731601',
          nombre: 'E. B. C Numero 2 3 6 Las Delicias',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02741601',
          nombre: 'E. B. U 386 Rio Cocollar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02751601',
          nombre: 'E. B. U La Pica',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD08921601',
          nombre: 'Liceo Bolivariano Loma de La Virgen',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD09801601',
          nombre: 'Centro Educacion Inicial Bolivariano Teresa Heredia',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S0532D1601',
          nombre: 'U. E. Manuel Saturnino Peñalver Gomez',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'S4702D1601',
          nombre: 'E. B. Francisco Javier Yanes',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01621601',
          nombre: 'E. B. B Dr Julian Padron',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02681601',
          nombre: 'E. B. C Numero 20 510 El Banqueado',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02621601',
          nombre: 'E. B. B Simón Rodriguez II Monte Oscuro',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02631601',
          nombre: 'E. B. U La Laguna de Ipure',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02641601',
          nombre: 'E. B. U Numero 29 La Ceiba',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02651601',
          nombre: 'E. B. C Bella Vista',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02661601',
          nombre: 'E. B. U. E. L Mango de Capiricual',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02671601',
          nombre: 'E. B. C 513 La Cagua',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02691601',
          nombre: 'E. B. C Numero 24 25 El Palmar',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02701601',
          nombre: 'E. B. B Numero17 Los Caballos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02711601',
          nombre: 'E. B. C 6 11 388 439 Loma de La Virgen',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD02801601', nombre: 'U. E. Ipure', zona_educativa: 'VE-N' },
        {
          dea: 'OD01021601',
          nombre: 'E. B. Simón Rodriguez Jobo Mocho',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01341601',
          nombre: 'E. B. C Numero 36 247 Corocillos',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD01611601',
          nombre: 'E. B. B Teresa Heredia',
          zona_educativa: 'VE-N',
        },
        { dea: 'OD01631601', nombre: 'J I El Limon', zona_educativa: 'VE-N' },
        {
          dea: 'OD01651601',
          nombre: 'E. B. U Numero 30 El Manguito',
          zona_educativa: 'VE-N',
        },
        {
          dea: 'OD02601601',
          nombre: 'E. B. C Numero 389 391 Las Piñas',
          zona_educativa: 'VE-N',
        },
      ],
    }),

    prisma.titulos_de_pregrado.createMany({
      data: [
        { id: 2, nombre: 'Analista De Sistemas' },
        { id: 3, nombre: 'Antropólogo' },
        { id: 4, nombre: 'Arquitecto' },
        { id: 5, nombre: 'Contador Público' },
        { id: 6, nombre: 'Criminólogo' },
        { id: 7, nombre: 'Economista' },
        { id: 8, nombre: 'Economista Agrícola' },
        { id: 9, nombre: 'Farmacéutico' },
        { id: 10, nombre: 'Geólogo' },
        { id: 11, nombre: 'Licenciado En Geoquímica' },
        { id: 12, nombre: 'Ingeniero De Producción Agropecuaria' },
        {
          id: 13,
          nombre: 'Ingeniero Del Ambiente Y De Los Recursos Naturales',
        },
        { id: 14, nombre: 'Ingeniero Electrónico Mención Telecomunicaciones' },
        { id: 15, nombre: 'Ingeniero Aeronáutico' },
        { id: 16, nombre: 'Ingeniero Agrícola' },
        { id: 17, nombre: 'Ingeniero Agroindustrial' },
        { id: 18, nombre: 'Ingeniero Agrónomo' },
        { id: 19, nombre: 'Ingeniero Agrónomo De Producción Animal' },
        { id: 20, nombre: 'Ingeniero Agrónomo De Producción Vegetal' },
        { id: 21, nombre: 'Ingeniero Civil' },
        { id: 22, nombre: 'Ingeniero De Alimentos' },
        { id: 23, nombre: 'Ingeniero En Mantenimiento' },
        { id: 24, nombre: 'Ingeniero De Materiales' },
        { id: 25, nombre: 'Ingeniero De Minas' },
        { id: 26, nombre: 'Ingeniero De Petróleo' },
        { id: 27, nombre: 'Ingeniero De Producción' },
        { id: 28, nombre: 'Ingeniero De Producción Animal' },
        { id: 29, nombre: 'Ingeniero De Recursos Naturales Renovables' },
        { id: 30, nombre: 'Ingeniero De Sistemas' },
        { id: 31, nombre: 'Ingeniero De Telecomunicaciones' },
        { id: 32, nombre: 'Ingeniero Del Ambiente' },
        {
          id: 33,
          nombre:
            'Ingeniero Del Ambiente Y De Los Recursos Naturales Renovables',
        },
        { id: 34, nombre: 'Ingeniero Electricista' },
        { id: 35, nombre: 'Ingeniero Electrónico' },
        { id: 36, nombre: 'Ingeniero Electrónico De Computación' },
        { id: 37, nombre: 'Ingeniero En Administración De Obras' },
        { id: 38, nombre: 'Ingeniero En Computación' },
        { id: 39, nombre: 'Ingeniero En Diseño Industrial' },
        { id: 40, nombre: 'Ingeniero En Industria Forestal' },
        { id: 41, nombre: 'Ingeniero En Información' },
        { id: 42, nombre: 'Ingeniero En Informática' },
        { id: 43, nombre: 'Ingeniero En Mantenimiento De Obras' },
        { id: 44, nombre: 'Ingeniero En Mantenimiento Mecánico' },
        { id: 45, nombre: 'Ingeniero En Telecomunicaciones' },
        { id: 46, nombre: 'Ingeniero Forestal' },
        { id: 47, nombre: 'Ingeniero Geodesta' },
        { id: 48, nombre: 'Ingeniero Geofísico' },
        { id: 49, nombre: 'Ingeniero Geólogo' },
        { id: 50, nombre: 'Ingeniero Hidrometeorológico' },
        { id: 51, nombre: 'Ingeniero Industrial' },
        { id: 52, nombre: 'Ingeniero Mecánico' },
        { id: 53, nombre: 'Ingeniero Mecánico Mención Mantenimiento' },
        { id: 54, nombre: 'Ingeniero Metalúrgico' },
        { id: 55, nombre: 'Ingeniero Naval' },
        { id: 56, nombre: 'Ingeniero Pesquero' },
        { id: 57, nombre: 'Ingeniero Químico' },
        { id: 59, nombre: 'Licenciado En Acuacultura' },
        { id: 60, nombre: 'Licenciado En Artes Mención. Museología' },
        { id: 61, nombre: 'Licenciado En Biología Marina' },
        {
          id: 62,
          nombre: 'Licenciado En Ciencia Y Cultura De La Alimentación',
        },
        { id: 63, nombre: 'Licenciado En Ciencias Actuariales' },
        { id: 64, nombre: 'Licenciado En Ciencias Estadísticas' },
        { id: 66, nombre: 'Licenciado En Comercio Internacional' },
        { id: 67, nombre: 'Licenciado En Economía Agrícola' },
        { id: 68, nombre: 'Licenciado En Economía De La Ind. Forestal' },
        { id: 69, nombre: 'Licenciado En Economía Empresarial' },
        {
          id: 70,
          nombre: 'Licenciado En Educación Mención Ciencias De La Religión',
        },
        {
          id: 72,
          nombre: 'Licenciado En Educación Mención Pedagogía Religiosa',
        },
        { id: 73, nombre: 'Licenciado En Educación Mención Técnica Mercantil' },
        {
          id: 74,
          nombre: 'Licenciado En Educación Industrial Mención Electricidad',
        },
        {
          id: 75,
          nombre: 'Licenciado En Educación Industrial Mención Mecánica',
        },
        { id: 76, nombre: 'Licenciado En Educación Mención Agropecuaria' },
        {
          id: 77,
          nombre:
            'Licenciado En Educación Mención Física, Deporte Y Recreación',
        },
        {
          id: 78,
          nombre: 'Licenciado En Educación Mención Castellano Y Literatura',
        },
        { id: 79, nombre: 'Licenciado En Educación Mención Ciencias Sociales' },
        { id: 80, nombre: 'Licenciado En Educación Mención Filosofía' },
        { id: 81, nombre: 'Licenciado En Educación Mención Gerencia' },
        { id: 82, nombre: 'Licenciado En Educación Mención Inglés' },
        {
          id: 83,
          nombre: 'Licenciado En Educación Mención Lenguas Extranjeras',
        },
        { id: 84, nombre: 'Licenciado En Educación Mención Lenguas Modernas' },
        {
          id: 85,
          nombre: 'Licenciado En Estudios Políticos Y Administrativos',
        },
        { id: 86, nombre: 'Licenciado En Gerencia Agroindustrial' },
        { id: 87, nombre: 'Licenciado En Gerencia De Recursos Humanos' },
        { id: 88, nombre: 'Licenciado En Historia Eclesiástica' },
        { id: 89, nombre: 'Licenciado En Letras Mención Historia Del Arte' },
        {
          id: 90,
          nombre: 'Licenciado En Letras Mención Lengua Y Literatura Moderna',
        },
        { id: 91, nombre: 'Licenciado En Medios Audiovisuales' },
        { id: 92, nombre: 'Licenciado En Música Mención. Musicología' },
        { id: 93, nombre: 'Licenciado En Tecnología De Alimentos' },
        { id: 94, nombre: 'Licenciado En Teología Mención Filosofía' },
        { id: 95, nombre: 'Licenciado En Administración' },
        { id: 96, nombre: 'Licenciado En Administración Comercial' },
        { id: 97, nombre: 'Licenciado En Administración De Empresas' },
        {
          id: 98,
          nombre: 'Licenciado En Administración Mención Empresas Agropecuarias',
        },
        {
          id: 99,
          nombre: 'Licenciado En Administración De Empresas De Diseño',
        },
        {
          id: 100,
          nombre: 'Licenciado En Administración De Empresas Turísticas',
        },
        {
          id: 102,
          nombre: 'Licenciado En Administración Mención Banca Y Finanzas',
        },
        {
          id: 103,
          nombre: 'Licenciado En Administración Mención Gerencia Industrial',
        },
        { id: 104, nombre: 'Licenciado En Administración Mención Mercadeo' },
        { id: 105, nombre: 'Licenciado En Admón. De Fincas' },
        { id: 106, nombre: 'Licenciado En Artes' },
        { id: 107, nombre: 'Licenciado En Artes Mención Diseño Gráfico' },
        { id: 108, nombre: 'Licenciado En Artes Plásticas' },
        { id: 109, nombre: 'Licenciado En Artes Visuales' },
        { id: 110, nombre: 'Licenciado En Bibliotecología Y Archivología' },
        { id: 111, nombre: 'Licenciado En Bioanálisis' },
        { id: 112, nombre: 'Licenciado En Biología' },
        { id: 113, nombre: 'Licenciado En Biología Pesquera' },
        { id: 114, nombre: 'Licenciado En Ciencias Administrativas' },
        {
          id: 115,
          nombre: 'Licenciado En Ciencias Administrativas Y Gerenciales',
        },
        { id: 116, nombre: 'Licenciado En Ciencias Policiales' },
        { id: 117, nombre: 'Licenciado En Ciencias Políticas' },
        { id: 118, nombre: 'Licenciado En Computación' },
        { id: 119, nombre: 'Licenciado En Comunicación Social' },
        { id: 1, nombre: 'Abogado' },
        { id: 121, nombre: 'Licenciado En Contaduría Pública' },
        { id: 122, nombre: 'Licenciado En Criminalística' },
        { id: 123, nombre: 'Licenciado En Danza' },
        { id: 124, nombre: 'Licenciado En Derecho Canónico' },
        { id: 125, nombre: 'Licenciado En Diseño Gráfico' },
        { id: 126, nombre: 'Licenciado En Educación' },
        { id: 127, nombre: 'Licenciado En Educación Básica Integral' },
        {
          id: 128,
          nombre:
            'Licenciado En Educación Mención Ciencias Y Tecnología De La Educación',
        },
        { id: 129, nombre: 'Licenciado En Educación Especial' },
        { id: 130, nombre: 'Licenciado En Educación Física' },
        { id: 131, nombre: 'Licenciado En Educación Integral' },
        {
          id: 132,
          nombre:
            'Licenciado En Educación Mención Geografía Y Ciencias De La Tierra',
        },
        { id: 133, nombre: 'Licenciado En Educación Mención Básica Integral' },
        { id: 134, nombre: 'Licenciado En Educación Mención Biología' },
        {
          id: 135,
          nombre: 'Licenciado En Educación Mención Biología Y Química',
        },
        {
          id: 136,
          nombre: 'Licenciado En Educación Mención Ciencias Biológicas',
        },
        {
          id: 137,
          nombre: 'Licenciado En Educación Mención Ciencias Pedagógicas',
        },
        { id: 138, nombre: 'Licenciado En Educación Mención Computación' },
        { id: 139, nombre: 'Licenciado En Educación Mención Física' },
        {
          id: 140,
          nombre: 'Licenciado En Educación Mención Física Y Matemática',
        },
        {
          id: 141,
          nombre: 'Licenciado En Educación Mención Geografía E Historia',
        },
        { id: 142, nombre: 'Licenciado En Educación Mención Geografia' },
        { id: 143, nombre: 'Licenciado En Educación Mención Historia' },
        { id: 144, nombre: 'Licenciado En Educación Mención Idiomas Modernos' },
        { id: 145, nombre: 'Licenciado En Educación Mención Informática' },
        {
          id: 146,
          nombre:
            'Licenciado En Educación Mención Informática O Licenciado En Educación Mención Informática Y Matemática',
        },
        { id: 147, nombre: 'Licenciado En Educación Mención Integral' },
        { id: 148, nombre: 'Licenciado En Educación Mención Matemática' },
        {
          id: 149,
          nombre: 'Licenciado En Educación Mención Matemática Y Física',
        },
        { id: 150, nombre: 'Licenciado En Educación Mención Preescolar' },
        { id: 151, nombre: 'Licenciado En Educación Mención Química' },
        { id: 152, nombre: 'Licenciado En Educación Preescolar' },
        {
          id: 153,
          nombre: 'Licenciado En Educación: Ciencias Físico-Naturales',
        },
        { id: 154, nombre: 'Licenciado En Enfermería' },
        { id: 155, nombre: 'Licenciado En Estadística' },
        { id: 156, nombre: 'Licenciado En Estudios Ambientales' },
        { id: 157, nombre: 'Licenciado En Estudios Internacionales' },
        { id: 158, nombre: 'Licenciado En Filosofía' },
        { id: 159, nombre: 'Licenciado En Física' },
        { id: 160, nombre: 'Licenciado En Fisioterapia' },
        { id: 161, nombre: 'Licenciado En Geografía' },
        { id: 162, nombre: 'Licenciado En Historia' },
        {
          id: 163,
          nombre: 'Licenciado En Historia De Las Artes Plásticas Y Museología',
        },
        { id: 164, nombre: 'Licenciado En Hotelería' },
        { id: 165, nombre: 'Licenciado En Idiomas Modernos' },
        { id: 166, nombre: 'Licenciado En Informática' },
        { id: 167, nombre: 'Licenciado En Letras' },
        { id: 168, nombre: 'Licenciado En Letras Hispánicas' },
        {
          id: 169,
          nombre:
            'Licenciado En Letras Mención Lengua Y Literatura Hispanoamericana Y Venezolana',
        },
        { id: 170, nombre: 'Licenciado En Matemática' },
        { id: 171, nombre: 'Licenciado En Mercadeo' },
        { id: 172, nombre: 'Licenciado En Música' },
        { id: 173, nombre: 'Licenciado En Nutrición Y Dietética' },
        { id: 174, nombre: 'Licenciado En Planificación' },
        { id: 175, nombre: 'Licenciado En Psicología' },
        { id: 176, nombre: 'Licenciado En Publicidad' },
        { id: 177, nombre: 'Licenciado En Química' },
        { id: 178, nombre: 'Licenciado En Relaciones Industriales' },
        { id: 179, nombre: 'Licenciado En Sociología' },
        { id: 180, nombre: 'Licenciado En Teatro' },
        { id: 181, nombre: 'Licenciado En Teología' },
        { id: 182, nombre: 'Licenciado En Trabajo Social' },
        { id: 183, nombre: 'Licenciado En Turismo' },
        {
          id: 184,
          nombre:
            'Maestro De Niños Sordos Y De Niños Con Trastornos Del Lenguaje',
        },
        { id: 186, nombre: 'Maestro Especialista En Educación Integral' },
        { id: 187, nombre: 'Médico Cirujano' },
        { id: 188, nombre: 'Médico Veterinario' },
        { id: 189, nombre: 'Odontólogo' },
        { id: 193, nombre: 'Politólogo' },
        { id: 194, nombre: 'Profesor De Educación Agropecuaria' },
        { id: 199, nombre: 'Profesor De Artes Industriales' },
        { id: 206, nombre: 'Profesor De Electricidad Industrial' },
        { id: 209, nombre: 'Profesor De Informática' },
        { id: 210, nombre: 'Profesor De Lengua Y Literatura' },
        { id: 212, nombre: 'Profesor De Mecánica Industrial' },
        { id: 214, nombre: 'Profesor En Dibujo Técnico' },
        { id: 215, nombre: 'Profesor En Educación Comercial' },
        { id: 216, nombre: 'Profesor En Educación Integral' },
        { id: 217, nombre: 'Profesor En Educación Intercultural Bilingüe' },
        { id: 219, nombre: 'Profesor En Educación Rural' },
        { id: 222, nombre: 'Psicólogo' },
        { id: 223, nombre: 'Sociólogo' },
        {
          id: 224,
          nombre:
            'Sub-Oficial De La Armada Y Técnico Superior En Ciencias Navales',
        },
        {
          id: 225,
          nombre:
            'Sub-Oficial Y Técnico Superior En Comunicaciones Y Electrónica',
        },
        {
          id: 226,
          nombre:
            'Sub-Oficial Del Ejército Y Técnico Superior Universitario En Ciencias Y Artes Militares',
        },
        {
          id: 227,
          nombre: 'Sub-Oficial Y Técnico Superior De La Guardia Nacional',
        },
        {
          id: 228,
          nombre: 'Sub-Oficial Y Técnico Superior En Ciencias Aeronáuticas',
        },
        {
          id: 229,
          nombre:
            'Sub-Teniente De La Aviación Militar Venezolana Y Licenciado En Ciencias Y Artes Militares Opción Aeronáutica',
        },
        {
          id: 230,
          nombre:
            'Técnico Superior Universitario En Administración. De Empresas Agropecuarias',
        },
        {
          id: 231,
          nombre: 'Técnico Superior Universitario En Ciencias Agropecuarias',
        },
        {
          id: 233,
          nombre: 'Técnico Superior Universitario En Tecnología Agroforestal',
        },
        {
          id: 234,
          nombre: 'Técnico Superior Universitario En Tecnología Agropecuaria',
        },
        {
          id: 235,
          nombre:
            'Técnico Superior Universitario En Tecnología De Admón. De Fincas',
        },
        {
          id: 236,
          nombre:
            'Técnico Superior Universitario Especialista En Retardo Mental Y Dificultades Del Aprendizaje',
        },
        {
          id: 237,
          nombre: 'Técnico Superior Educación Mención Física Y Deportes',
        },
        {
          id: 239,
          nombre: 'Técnico Superior En Administración: Publicidad Y Mercadeo',
        },
        { id: 241, nombre: 'Técnico Superior En Admón. De Banca Y Finanzas' },
        { id: 242, nombre: 'Técnico Superior En Admón: Banca Y Finanzas' },
        { id: 243, nombre: 'Técnico Superior En Ciencias Policiales' },
        { id: 246, nombre: 'Técnico Superior En Diseño Gráfico' },
        {
          id: 247,
          nombre:
            'Técnico Superior En Educación Física; Deportes Y Recreación Para Personas Con Necesidades Especiales',
        },
        {
          id: 248,
          nombre: 'Técnico Superior En Educación Mención Educación Especial',
        },
        {
          id: 249,
          nombre: 'Técnico Superior En Educación Mención Educación Integral',
        },
        {
          id: 250,
          nombre:
            'Técnico Superior En Electricidad Mención Instalaciones Eléctricas',
        },
        { id: 251, nombre: 'Técnico Superior En Electrónica' },
        { id: 252, nombre: 'Técnico Superior En Fisioterapia' },
        {
          id: 253,
          nombre:
            'Técnico Superior En Gerencia Del Ambiente O Técnico Superior Universitario En Tecnología Del Ambiente',
        },
        { id: 254, nombre: 'Técnico Superior En Idiomas Mención Inglés' },
        {
          id: 255,
          nombre: 'Técnico Superior En Metalurgia Y Ciencias De Los Materiales',
        },
        { id: 256, nombre: 'Técnico Superior En Policía Preventiva' },
        { id: 257, nombre: 'Técnico Superior En Radiología E Imagenología' },
        { id: 258, nombre: 'Técnico Superior En Salud Bucal: Higiene Bucal' },
        { id: 259, nombre: 'Técnico Superior En Salud Bucal: Mecánica Dental' },
        { id: 260, nombre: 'Técnico Superior En Secretaría' },
        { id: 261, nombre: 'Técnico Superior En Tecnología Administrativa' },
        {
          id: 262,
          nombre:
            'Técnico Superior En Tecnología De Conservación De Los Recursos Naturales Renovables',
        },
        {
          id: 263,
          nombre:
            'Técnico Superior En Tecnología De Recursos Naturales Renovables',
        },
        {
          id: 267,
          nombre: 'Técnico Superior Universitario En Terapia Ocupacional',
        },
        {
          id: 268,
          nombre:
            'Técnico Superior Especialista En Retardo Mental Y Dificultades Del Aprendizaje',
        },
        { id: 269, nombre: 'Técnico Superior Hacendista: Rentas - Aduanas' },
        {
          id: 270,
          nombre:
            'Técnico Superior Universitario En Administración Banca Y Finanzas',
        },
        {
          id: 271,
          nombre: 'Técnico Superior Universitario En Administración De Compras',
        },
        {
          id: 272,
          nombre:
            'Técnico Superior Universitario En Administración Mención Riesgos Y Seguros',
        },
        {
          id: 273,
          nombre: 'Técnico Superior Universitario En Administración De Ventas',
        },
        {
          id: 274,
          nombre:
            'Técnico Superior Universitario En Administración: Contaduría',
        },
        {
          id: 275,
          nombre: 'Técnico Superior Universitario En Administración: Costos',
        },
        {
          id: 276,
          nombre: 'Técnico Superior Universitario En Administración: Mercadeo',
        },
        {
          id: 277,
          nombre:
            'Técnico Superior Universitario En Administración: Mercadotecnia',
        },
        {
          id: 278,
          nombre:
            'Técnico Superior Universitario En Admón: Bancaria Y Financiera',
        },
        {
          id: 279,
          nombre:
            'Técnico Superior Universitario En Admón: Sistemas Administrativos Y Contables',
        },
        { id: 280, nombre: 'Técnico Superior Universitario En Agrotecnia' },
        {
          id: 281,
          nombre:
            'Técnico Superior Universitario En Artes Audiovisuales Mención Televisión',
        },
        {
          id: 282,
          nombre: 'Técnico Superior Universitario En Ciencias Administrativas',
        },
        {
          id: 284,
          nombre:
            'Técnico Superior En Educación Especial Menciónes Retardo Mental Y Dificultades Del Aprendizaje',
        },
        {
          id: 285,
          nombre:
            'Técnico Superior Universitario En Educación Mención Integral',
        },
        {
          id: 286,
          nombre:
            'Técnico Superior Universitario En Educación Mención Preescolar',
        },
        { id: 287, nombre: 'Técnico Superior Universitario En Imagenología' },
        {
          id: 288,
          nombre: 'Técnico Superior Universitario En Instalaciones Eléctricas',
        },
        {
          id: 289,
          nombre:
            'Técnico Superior Universitario En Manejo De Emergencias Y Acción Contra Desastres',
        },
        {
          id: 290,
          nombre:
            'Técnico Superior Universitario En Mantenimiento De Edificaciones',
        },
        {
          id: 291,
          nombre:
            'Técnico Superior Universitario En Mecánica Automotriz O Tecnología Automotriz',
        },
        { id: 292, nombre: 'Técnico Superior Universitario En Mercadotecnia' },
        { id: 293, nombre: 'Técnico Superior Universitario En Preescolar' },
        {
          id: 294,
          nombre:
            'Técnico Superior Universitario En Rehabilitación: Terapia Ocupacional',
        },
        {
          id: 295,
          nombre: 'Técnico Superior Universitario En Sistemas Industriales',
        },
        {
          id: 296,
          nombre:
            'Técnico Superior Universitario En Tec. De Seguridad Industrial',
        },
        {
          id: 297,
          nombre:
            'Técnico Superior Universitario En Tecn. De Producción Agroalimentaria',
        },
        {
          id: 298,
          nombre:
            'Técnico Superior Universitario En Tecnología De Administración De Obras',
        },
        {
          id: 299,
          nombre:
            'Técnico Superior Universitario En Tecnología Naval Mención Navegación Y Pesca',
        },
        {
          id: 300,
          nombre: 'Técnico Superior Universitario Rehabilitación: Fisioterapia',
        },
        {
          id: 301,
          nombre: 'Técnico Superior Universitario En Tecnología Mecánica',
        },
        {
          id: 302,
          nombre: 'Técnico Superior En Higiene Y Seguridad Industrial',
        },
        { id: 303, nombre: 'Técnico Superior Cardiopulmonar' },
        { id: 304, nombre: 'Técnico Superior Citotecnólogo' },
        { id: 305, nombre: 'Técnico Superior En Tecnología Minera' },
        { id: 306, nombre: 'Técnico Superior Agroindustrial' },
        { id: 307, nombre: 'Técnico Superior Asistente Al Médico Veterinario' },
        { id: 308, nombre: 'Técnico Superior En Tecnología Bomberil' },
        { id: 309, nombre: 'Técnico Superior En Administración' },
        { id: 310, nombre: 'Técnico Superior En Administración Aduanera' },
        {
          id: 311,
          nombre: 'Técnico Superior En Administración Bancaria Y Financiera',
        },
        { id: 312, nombre: 'Técnico Superior En Administración De Empresas' },
        {
          id: 313,
          nombre:
            'Técnico Superior En Administración De Empresas Agropecuarias',
        },
        {
          id: 314,
          nombre: 'Técnico Superior En Administración De Empresas Hoteleras',
        },
        {
          id: 315,
          nombre: 'Técnico Superior En Administración De Empresas Petroleras',
        },
        {
          id: 317,
          nombre:
            'Técnico Superior En Administración De Personal O Recursos Humanos',
        },
        {
          id: 318,
          nombre:
            'Técnico Superior En Administración De Recursos Físicos Y Financieros',
        },
        {
          id: 319,
          nombre: 'Técnico Superior En Administración De Salud Y Hospitales',
        },
        {
          id: 320,
          nombre: 'Técnico Superior En Administración De Servicios De La Salud',
        },
        {
          id: 321,
          nombre:
            'Técnico Superior En Administración De Sistemas De Mantenimiento',
        },
        {
          id: 322,
          nombre: 'Técnico Superior En Administración Del Transporte',
        },
        { id: 323, nombre: 'Técnico Superior En Administración Del Turismo' },
        { id: 324, nombre: 'Técnico Superior En Administración Hotelera' },
        { id: 325, nombre: 'Técnico Superior En Administración Industrial' },
        {
          id: 326,
          nombre:
            'Técnico Superior En Administración Mención Comercio Exterior',
        },
        {
          id: 327,
          nombre:
            'Técnico Superior En Administración Mención Fiscal Y Tributaria',
        },
        {
          id: 328,
          nombre: 'Técnico Superior En Administración Mención Presupuesto',
        },
        {
          id: 329,
          nombre: 'Técnico Superior En Administración Mención Recursos Humanos',
        },
        {
          id: 330,
          nombre:
            'Técnico Superior En Administración Mención Seguros Mercantiles',
        },
        {
          id: 331,
          nombre:
            'Técnico Superior En Administración Mención Transporte Y Distribución De Bienes',
        },
        { id: 332, nombre: 'Técnico Superior En Administración Municipal' },
        {
          id: 333,
          nombre:
            'Técnico Superior En Administración O Administración Y Ciencias Comerciales',
        },
        { id: 334, nombre: 'Técnico Superior En Administración Tributaria' },
        {
          id: 335,
          nombre: 'Técnico Superior En Administración Y Bienes Comerciales',
        },
        {
          id: 336,
          nombre: 'Técnico Superior En Administración Y Ciencias Comerciales',
        },
        { id: 337, nombre: 'Técnico Superior En Administración Y Gerencia' },
        {
          id: 338,
          nombre: 'Técnico Superior En Administración: Contabilidad De Costos',
        },
        {
          id: 339,
          nombre: 'Técnico Superior En Administración: Contabilidad Y Finanzas',
        },
        { id: 340, nombre: 'Técnico Superior En Administración: Contaduría' },
        {
          id: 341,
          nombre: 'Técnico Superior En Administración: Mercadeo Agrícola',
        },
        {
          id: 342,
          nombre: 'Técnico Superior En Administración: Organización Y Sistemas',
        },
        {
          id: 343,
          nombre:
            'Técnico Superior En Admón. Y Planif. De Empresas Agropecuarias',
        },
        { id: 344, nombre: 'Técnico Superior En Agropecuaria' },
        {
          id: 345,
          nombre: 'Técnico Superior En Análisis Y Diseño De Sistemas',
        },
        { id: 346, nombre: 'Técnico Superior En Animación Ambiental' },
        { id: 347, nombre: 'Técnico Superior En Asistencia Especializada' },
        { id: 348, nombre: 'Técnico Superior En Banca Y Finanzas' },
        { id: 349, nombre: 'Técnico Superior En Calidad Integral' },
        {
          id: 350,
          nombre: 'Técnico Superior En Ciencias Audiovisuales Y Fotografía',
        },
        {
          id: 351,
          nombre: 'Técnico Superior Universitario En Comercio Exterior',
        },
        { id: 352, nombre: 'Técnico Superior En Computación' },
        { id: 353, nombre: 'Técnico Superior En Comunicación Y Electrónica' },
        { id: 354, nombre: 'Técnico Superior En Comunicaciones Y Electrónica' },
        { id: 355, nombre: 'Técnico Superior En Construcción Civil' },
        {
          id: 356,
          nombre:
            'Técnico Superior En Construcción Civil O En Tecnología De La Construcción Civil',
        },
        { id: 357, nombre: 'Técnico Superior En Contabilidad Computarizada' },
        { id: 358, nombre: 'Técnico Superior En Contaduría' },
        { id: 359, nombre: 'Técnico Superior En Contabilidad Y Finanzas' },
        { id: 360, nombre: 'Técnico Superior En Control De Calidad' },
        {
          id: 361,
          nombre:
            'Técnico Superior En Control De Procesos Y Telecomunicaciones',
        },
        { id: 362, nombre: 'Técnico Superior En Controles Automáticos' },
        { id: 363, nombre: 'Técnico Superior En Criminalística' },
        { id: 364, nombre: 'Técnico Superior En Deportes' },
        { id: 365, nombre: 'Técnico Superior En Diseño Ambiental' },
        { id: 366, nombre: 'Técnico Superior En Diseño De Joyas Y Fantasías' },
        { id: 367, nombre: 'Técnico Superior En Diseño De Modas' },
        { id: 368, nombre: 'Técnico Superior En Diseño De Obras Civiles' },
        { id: 370, nombre: 'Técnico Superior En Diseño Gráfico Publicitario' },
        { id: 371, nombre: 'Técnico Superior En Diseño Industrial' },
        { id: 372, nombre: 'Técnico Superior En Diseño Interior' },
        { id: 373, nombre: 'Técnico Superior En Diseño Textil' },
        { id: 376, nombre: 'Técnico Superior En Educación Integral' },
        {
          id: 377,
          nombre: 'Técnico Superior En Educación Mención Educación Preescolar',
        },
        { id: 378, nombre: 'Técnico Superior En Educación Preescolar' },
        { id: 380, nombre: 'Técnico Superior Universitario En Electricidad' },
        { id: 381, nombre: 'Técnico Superior En Electromedicina' },
        { id: 383, nombre: 'Técnico Superior En Electrónica Industrial' },
        { id: 384, nombre: 'Técnico Superior En Electrotecnia' },
        { id: 385, nombre: 'Técnico Superior En Empresas Turísticas' },
        { id: 386, nombre: 'Técnico Superior En Enfermería' },
        { id: 387, nombre: 'Técnico Superior En Estadística De La Salud' },
        { id: 388, nombre: 'Técnico Superior En Geología' },
        { id: 389, nombre: 'Técnico Superior En Geología Y Minas' },
        { id: 390, nombre: 'Técnico Superior En Gerencia De Condominio' },
        { id: 391, nombre: 'Técnico Superior En Gerencia De Oficinas' },
        {
          id: 392,
          nombre: 'Técnico Superior En Gerencia De Procesos Hospitalarios',
        },
        { id: 393, nombre: 'Técnico Superior En Gerencia Financiera' },
        { id: 394, nombre: 'Técnico Superior En Gerencia Hotelera' },
        { id: 395, nombre: 'Técnico Superior En Gerencia Industrial' },
        { id: 396, nombre: 'Técnico Superior En Gerontología' },
        { id: 397, nombre: 'Técnico Superior En Hidrocarburos' },
        { id: 398, nombre: 'Técnico Superior En Hotelería' },
        {
          id: 399,
          nombre:
            'Técnico Superior En Hotelería Y Servicios De La Hospitalidad',
        },
        { id: 400, nombre: 'Técnico Superior En Información De La Salud' },
        { id: 401, nombre: 'Técnico Superior En Informática' },
        { id: 402, nombre: 'Técnico Superior En Inspección Sanitaria' },
        { id: 403, nombre: 'Técnico Superior En Instrumentación' },
        { id: 404, nombre: 'Técnico Superior En Logística Industrial' },
        { id: 405, nombre: 'Técnico Superior En Mant. Aeronáutico' },
        {
          id: 406,
          nombre:
            'Técnico Superior En Mantenimiento De Equipos Electromecánicos',
        },
        {
          id: 407,
          nombre: 'Técnico Superior En Mantenimiento De Equipos Eléctricos',
        },
        {
          id: 408,
          nombre:
            'Técnico Superior En Mantenimiento De Maquinaria Agrícola Y Pesada',
        },
        { id: 409, nombre: 'Técnico Superior En Mantenimiento Industrial' },
        { id: 410, nombre: 'Técnico Superior En Mantenimiento Mecánico' },
        { id: 411, nombre: 'Técnico Superior Universitario En Mecánica' },
        {
          id: 412,
          nombre: 'Técnico Superior Universitario En Mecánica Industrial',
        },
        { id: 413, nombre: 'Técnico Superior En Mecánica Térmica' },
        { id: 414, nombre: 'Técnico Superior En Mercadeo' },
        { id: 415, nombre: 'Técnico Superior En Mercadotecnia' },
        { id: 416, nombre: 'Técnico Superior En Metalurgia' },
        { id: 418, nombre: 'Técnico Superior En Minería' },
        { id: 419, nombre: 'Técnico Superior En Obras Civiles' },
        {
          id: 420,
          nombre: 'Técnico Superior Universitario En Organización Empresarial',
        },
        {
          id: 421,
          nombre: 'Técnico Superior En Pesca Continental Y Piscicultura',
        },
        { id: 422, nombre: 'Técnico Superior En Petróleo' },
        {
          id: 423,
          nombre:
            'Técnico Superior En Planificación Y Admón. De Empresas Agropecuaria',
        },
        { id: 424, nombre: 'Técnico Superior En Polímeros' },
        { id: 425, nombre: 'Técnico Superior En Preescolar' },
        {
          id: 426,
          nombre:
            'Técnico Superior En Procesamiento Y Control De Calidad De Los Alimentos',
        },
        {
          id: 427,
          nombre: 'Técnico Superior En Procesos De Refinación De Petróleo',
        },
        { id: 428, nombre: 'Ingeniero En Procesos Químicos' },
        { id: 429, nombre: 'Técnico Superior En Producción Agropecuaria' },
        { id: 430, nombre: 'Técnico Superior En Producción Industrial' },
        {
          id: 431,
          nombre: 'Técnico Superior En Producción Y Supervisión Industrial',
        },
        { id: 432, nombre: 'Técnico Superior En Psicopedagogía' },
        { id: 433, nombre: 'Técnico Superior En Publicidad' },
        { id: 434, nombre: 'Técnico Superior En Publicidad Y Mercadeo' },
        {
          id: 435,
          nombre: 'Técnico Superior En Publicidad Y Relaciones Públicas',
        },
        { id: 436, nombre: 'Técnico Superior En Química' },
        { id: 437, nombre: 'Técnico Superior En Química Industrial' },
        { id: 438, nombre: 'Técnico Superior En Radiodiagnóstico' },
        { id: 439, nombre: 'Técnico Superior En Relaciones Industriales' },
        { id: 440, nombre: 'Técnico Superior En Relaciones Públicas' },
        { id: 441, nombre: 'Técnico Superior En Riesgos Y Seguro' },
        { id: 443, nombre: 'Técnico Superior En Secretariado Administrativo' },
        { id: 444, nombre: 'Técnico Superior En Seguridad Industrial' },
        { id: 445, nombre: 'Técnico Superior En Seguros' },
        { id: 446, nombre: 'Técnico Superior En Servicios De La Hospitalidad' },
        { id: 447, nombre: 'Técnico Superior En Servicios Industriales' },
        { id: 448, nombre: 'Técnico Superior En Sistemas De Información' },
        { id: 449, nombre: 'Técnico Superior En Tecnología Agrícola' },
        { id: 450, nombre: 'Técnico Superior En Tecnología Agropecuaria' },
        { id: 451, nombre: 'Técnico Superior En Tecnología Ambiental' },
        { id: 452, nombre: 'Técnico Superior En Tecnología Automotriz' },
        { id: 453, nombre: 'Técnico Superior En Tecnología De Alimentos' },
        {
          id: 454,
          nombre: 'Técnico Superior Universitario En Tecnología De Gas',
        },
        { id: 455, nombre: 'Técnico Superior En Tecnología De Incendios' },
        { id: 456, nombre: 'Técnico Superior En Tecnología De Los Materiales' },
        { id: 457, nombre: 'Técnico Superior En Tecnología De Mantenimiento' },
        { id: 458, nombre: 'Técnico Superior En Tecnología Ferroviaria' },
        { id: 459, nombre: 'Técnico Superior Universitario Forestal' },
        { id: 460, nombre: 'Técnico Superior En Tecnología Instrumentista' },
        {
          id: 461,
          nombre: 'Técnico Superior En Tecnología Mecánica O Mecánica',
        },
        { id: 462, nombre: 'Técnico Superior En Tecnología Naval' },
        {
          id: 463,
          nombre: 'Técnico Superior En Tecnología Naval Mención Mecánica Naval',
        },
        { id: 464, nombre: 'Técnico Superior En Tecnología Pecuaria' },
        { id: 465, nombre: 'Técnico Superior En Tecnología Pesquera' },
        {
          id: 466,
          nombre:
            'Técnico Superior En Tecnología Pesquera Mención Acuicultura Y Oceanografía',
        },
        { id: 467, nombre: 'Técnico Superior En Tecnología Textil' },
        { id: 468, nombre: 'Técnico Superior En Terapia Del Lenguaje' },
        { id: 469, nombre: 'Técnico Superior En Topografía' },
        { id: 470, nombre: 'Técnico Superior En Trabajo Social' },
        { id: 471, nombre: 'Técnico Superior En Turismo' },
        { id: 473, nombre: 'Técnico Superior Universitario Contador General' },
        { id: 474, nombre: 'Técnico Superior Universitario En Administración' },
        {
          id: 475,
          nombre: 'Técnico Superior Universitario En Administración De Aduanas',
        },
        {
          id: 476,
          nombre:
            'Técnico Superior Universitario En Administración En Informática',
        },
        {
          id: 477,
          nombre:
            'Técnico Superior Universitario En Administración Mención Finanzas',
        },
        {
          id: 478,
          nombre:
            'Técnico Superior Universitario En Administración: Informática',
        },
        {
          id: 479,
          nombre: 'Técnico Superior Universitario En Banca Y Finanzas',
        },
        {
          id: 480,
          nombre: 'Técnico Superior Universitario En Ciencias Fiscales',
        },
        { id: 481, nombre: 'Técnico Superior Universitario En Contabilidad' },
        { id: 482, nombre: 'Técnico Superior Universitario En Contaduría' },
        {
          id: 483,
          nombre: 'Técnico Superior Universitario En Educación Especial',
        },
        {
          id: 484,
          nombre:
            'Técnico Superior Universitario En Gestión Fiscal Y Tributaria',
        },
        {
          id: 485,
          nombre:
            'Técnico Superior Universitario En Mantenimiento De Equipos Mecánicos',
        },
        {
          id: 487,
          nombre: 'Técnico Superior Universitario En Tecn. Electrónica',
        },
        {
          id: 488,
          nombre: 'Técnico Superior Universitario En Tecnología Eléctrica',
        },
        { id: 490, nombre: 'Tecnólogo En Administración Industrial' },
        { id: 491, nombre: 'Tecnólogo En Computación' },
        { id: 492, nombre: 'Tecnólogo En Construcción Civil' },
        { id: 493, nombre: 'Tecnólogo En Estadística' },
        { id: 494, nombre: 'Tecnólogo En Fabric. Mecánica' },
        { id: 496, nombre: 'Tecnólogo En Industria Forestal' },
        { id: 497, nombre: 'Tecnólogo En Procesos Industriales' },
        { id: 498, nombre: 'Tecnólogo En Sistemas Industriales' },
        { id: 499, nombre: 'Urbanista' },
        { id: 500, nombre: 'Zootecnista' },
        { id: 502, nombre: 'Profesor En Pedagogía Social' },
        { id: 503, nombre: 'Técnico Superior En Ventas' },
        {
          id: 504,
          nombre:
            'Licenciado En Educación Especial Mención Dificultad De Aprendizaje',
        },
        {
          id: 505,
          nombre: 'Licenciado En Administración De Empresas: Riesgos Y Seguros',
        },
        { id: 506, nombre: 'Licenciado En Información Y Documentación' },
        {
          id: 507,
          nombre: 'Técnico Superior En Tecnología Radiológica Médica',
        },
        {
          id: 508,
          nombre: 'Licenciado En Educación Mención Lengua Y Literatura',
        },
        { id: 509, nombre: 'Licenciado En Diseño Industrial' },
        {
          id: 510,
          nombre: 'Licenciado En Letras Mención Lenguas Y Literaturas Clásicas',
        },
        { id: 511, nombre: 'Técnico Superior En Idiomas Modernos' },
        { id: 512, nombre: 'Técnico Superior En Información Y Documentación' },
        { id: 514, nombre: 'Profesor Especialidad Informática' },
        {
          id: 518,
          nombre: 'Licenciado En Administración Mención Recursos Humanos',
        },
        { id: 519, nombre: 'Licenciado En Administración Mención Informática' },
        { id: 520, nombre: 'Licenciado En Educación Mención Teología' },
        { id: 521, nombre: 'Ingeniero De Redes Y Comunicaciones' },
        {
          id: 522,
          nombre: 'Técnico Superior Universitario De Redes Y Comunicaciones',
        },
        {
          id: 523,
          nombre: 'Licenciado En Educación Mención Lengua Literatura Y Latín',
        },
        {
          id: 524,
          nombre: 'Licenciado En Ciencias Fiscales Mención Gasto Público',
        },
        {
          id: 526,
          nombre: 'Técnico Superior En Mercadeo Mención Comercio Exterior',
        },
        { id: 527, nombre: 'Técnico Superior En Tecnología Electrónica' },
        {
          id: 528,
          nombre: 'Técnico Superior Universitario En Tecnología Petrolera',
        },
        { id: 529, nombre: 'Técnico Superior En Instrumentación Y Control' },
        {
          id: 530,
          nombre: 'Técnico Superior En Seguridad E Higiene Industrial',
        },
        {
          id: 532,
          nombre: 'Técnico Superior Docente En Electricidad Industrial',
        },
        { id: 533, nombre: 'Técnico Superior En Gestión Hotelera' },
        { id: 534, nombre: 'Técnico Superior En Turismo Y Hoteleria' },
        { id: 535, nombre: 'Ingeniero De Gas' },
        { id: 537, nombre: 'Licenciado En Estudios Liberales' },
        { id: 538, nombre: 'Licenciado En Educación Mención Educación Física' },
        { id: 539, nombre: 'Licenciado En Ciencias Del Deporte' },
        { id: 540, nombre: 'Técnico Superior En Recreación' },
        {
          id: 541,
          nombre: 'Técnico Superior En Educación Mención Ciencias Religiosas',
        },
        {
          id: 542,
          nombre: 'Técnico Superior En Administración: Mercadotecnia',
        },
        { id: 543, nombre: 'Profesor. Especialidad: Educación Preescolar' },
        { id: 544, nombre: 'Profesor. Especialidad: Educación Integral' },
        { id: 545, nombre: 'Profesor. Especialidad: Matemática' },
        { id: 546, nombre: 'Profesor. Especialidad: Informática' },
        { id: 547, nombre: 'Profesor. Especialidad: Física' },
        { id: 548, nombre: 'Profesor. Especialidad: Biología' },
        { id: 549, nombre: 'Profesor. Especialidad: Química' },
        { id: 550, nombre: 'Profesor. Especialidad: Ciencias De La Tierra' },
        { id: 552, nombre: 'Profesor. Especialidad: Artes Plásticas' },
        { id: 553, nombre: 'Profesor. Especialidad: Dibujo Técnico' },
        { id: 554, nombre: 'Profesor. Especialidad: Artes Escénicas' },
        { id: 555, nombre: 'Profesor. Especialidad: Electrónica Industrial' },
        { id: 556, nombre: 'Profesor. Especialidad: Mecánica Industrial' },
        { id: 557, nombre: 'Profesor. Especialidad: Electricidad Industrial' },
        { id: 558, nombre: 'Profesor. Especialidad: Geografía E Historia' },
        { id: 561, nombre: 'Profesor. Especialidad: Educación Musical' },
        { id: 562, nombre: 'Profesor. Especialidad: Educación Física' },
        { id: 564, nombre: 'Profesor. Especialidad: Educación Agropecuaria' },
        {
          id: 565,
          nombre:
            'Profesor De Educación Especial. Especialidad: Dificultades De Aprendizaje',
        },
        {
          id: 566,
          nombre:
            'Profesor De Educación Especial. Especialidad: Retardo Mental',
        },
        {
          id: 567,
          nombre:
            'Profesor De Educación Especial. Especialidad: Deficiencias Auditivas',
        },
        {
          id: 569,
          nombre:
            'Técnico Superior En Tecnología De Alimentos Mención Procesamiento De Productos Pesqueros',
        },
        { id: 570, nombre: 'Técnico Superior En Mercadeo Mención Publicidad' },
        { id: 571, nombre: 'Ténico Superior En Emergencia Prehospitalaria' },
        { id: 572, nombre: 'Tecnólogo En Administración De Fincas' },
        {
          id: 573,
          nombre:
            'Subteniente De La República Y Licenciado En Ciencias Y Artes Militares Opción Guardia Nacional',
        },
        {
          id: 574,
          nombre: 'Licenciado En Ciencias Y Artes Militares Opción Terrestre',
        },
        {
          id: 575,
          nombre: 'Licenciado En Ciencias Navales Y Alférez De Navío',
        },
        {
          id: 576,
          nombre: 'Técnico Superior En Administración Bancaria Mención Banca',
        },
        { id: 577, nombre: 'Licenciado En Educación Mención Orientación' },
        { id: 579, nombre: 'Tecnico Superior En Educacón Especial' },
        {
          id: 580,
          nombre: 'Profesor Especialidad: Castellano, Literatura Y Latín',
        },
        {
          id: 582,
          nombre:
            'Tecnico Superior En Enfermería Y Sub-Oficial Profesional De Carrera (Sopc),',
        },
        { id: 583, nombre: 'Ingeniero Marítimo Oficial De La Marina Mercante' },
        {
          id: 586,
          nombre: 'Licenciado En Gestión Social Del Desarrollo Local',
        },
        { id: 587, nombre: 'Licenciado En Gestión Ambiental' },
        {
          id: 588,
          nombre: 'Licenciado En Educación Mención Historia Y Geografía',
        },
        { id: 589, nombre: 'Licenciado En Educación Mención Artes' },
        {
          id: 590,
          nombre: 'Técnico Superior En Educación Mención Pedagogía Religiosa',
        },
        { id: 591, nombre: 'Técnico Superior En Educación Mención Preescolar' },
        {
          id: 593,
          nombre:
            'Técnico Superior En Procesos Químicos Mención Tecnología Y Diseño',
        },
        {
          id: 594,
          nombre: 'Técnico Superior En Mantenimiento De Vías Férreas',
        },
        { id: 596, nombre: 'Técnico Superior En Ejecución Instrumental' },
        {
          id: 597,
          nombre:
            'Técnico Superior Universitario En Tecnología De Producción Agroalimentaria',
        },
        { id: 598, nombre: 'Licenciado En Publicidad Y Relaciones Públicas' },
        {
          id: 599,
          nombre:
            'Oficial De La Guardia Nacional Y Lic. En Ciencias Y Artes Militares',
        },
        {
          id: 600,
          nombre: 'Licenciado En Educación Lenguas Extranjeras Mención Inglés',
        },
        { id: 602, nombre: 'Profesor Especialidad Inglés' },
        {
          id: 603,
          nombre:
            'Profesor Especialidad: Educación Especial En Dificultades Del Aprendizaje',
        },
        { id: 604, nombre: 'Ingeniero En Molinería' },
        { id: 605, nombre: 'Técnico Superior En Cervecería' },
        { id: 606, nombre: 'Técnico Superior En Gestión Hotelera Y Turística' },
        { id: 607, nombre: 'Ingeniero Ambiental' },
        { id: 609, nombre: 'Licenciado En Idiomas Modernos Mención Inglés' },
        { id: 610, nombre: 'Técnico Superior En Administración De Personal' },
        { id: 611, nombre: 'Médico General Integralista' },
        { id: 612, nombre: 'Licenciado En Procesos Gerenciales' },
        { id: 613, nombre: 'Técnico Superior En Ecoturismo' },
        {
          id: 616,
          nombre: 'Técnico Superior En Empresas Y Alojamiento Turístico',
        },
        { id: 617, nombre: 'Técnico Superior Mención Contabilidad Y Finanzas' },
        {
          id: 619,
          nombre:
            'Técnico Superior En Administración Mención Contabilidad Y Finanzas',
        },
        { id: 620, nombre: 'Técnico Superior En Producción Agroalimentaria' },
        { id: 621, nombre: 'Licenciado En Gestión De La Hospitalidad' },
        {
          id: 622,
          nombre: 'Técnico Superior En Educación Mención Computación',
        },
        { id: 623, nombre: 'Técnico Superior En Educación Integral E Inglés' },
        {
          id: 624,
          nombre:
            'Técnico Superior En Educación Integral Y Dificultades De Aprendizaje',
        },
        {
          id: 625,
          nombre:
            'Técnico Superior Universitario En Educación Integral Mención Educación Física Y Deportes',
        },
        {
          id: 626,
          nombre:
            'Técnico Superior Universitario En Educación Integral Mención Física, Química Y Biología',
        },
        {
          id: 628,
          nombre:
            'Técnico Superior Universitario En Educación Mención Orientación',
        },
        {
          id: 629,
          nombre:
            'Técnico Superior Universitario En Psicología Mención Psicología Educativa',
        },
        {
          id: 631,
          nombre:
            'Técnico Superior Universitario En Psicología Mención Psicología Clínica',
        },
        {
          id: 632,
          nombre:
            'Técnico Superior Universitario En Psicología Mención Psicología Industrial',
        },
        {
          id: 633,
          nombre:
            'Técnico Superior Universitario En Transporte Y Distribución De Bienes',
        },
        {
          id: 634,
          nombre:
            'Técnico Superior En Tecnología Naval Mención Mécanica Y Mantenimiento Naval',
        },
        {
          id: 636,
          nombre: 'Técnico Superior En Administración Mención Costos',
        },
        {
          id: 637,
          nombre: 'Técnico Superior De La Guardia Nacional Mención Seguridad',
        },
        {
          id: 638,
          nombre:
            'Técnico Superior De La Guardia Nacional Mención Mantenimiento Aeronáutico',
        },
        {
          id: 639,
          nombre:
            'Técnico Superior De La Guardia Nacional Mención Mantenimiento Naval',
        },
        {
          id: 640,
          nombre:
            'Técnico Superior De La Guardia Nacional Mención Guardería Ambiental',
        },
        {
          id: 642,
          nombre:
            'Técnico Superior De La Guardia Nacional Mención Investigacion Penal',
        },
        {
          id: 643,
          nombre:
            'Técnico Superior De La Guardia Nacional Mención Mantenimiento Automotriz',
        },
        {
          id: 644,
          nombre: 'Técnico Superior De La Guardia Nacional Mención Drogas',
        },
        {
          id: 645,
          nombre:
            'Técnico Superior De La Guardia Nacional Mención Resguardo Nacional',
        },
        {
          id: 646,
          nombre: 'Técnico Superior En Administración Mención Aduanas',
        },
        {
          id: 647,
          nombre:
            'Técnico Superior Universitario En Prevención, Orientación Y Acción Social',
        },
        {
          id: 648,
          nombre: 'Técnico Superior Universitario En Terapia Psicosocial',
        },
        {
          id: 649,
          nombre:
            'Técnico Superior Universitario En Administración Mención Programas Sociales',
        },
        { id: 650, nombre: 'Profesor Especialidad:Francés' },
        {
          id: 652,
          nombre:
            'Técnico Superior En Tecnología De Información Ydocumentación',
        },
        { id: 660, nombre: 'Licenciado En Teatro Mención Actuación' },
        { id: 661, nombre: 'Licenciado En Teatro Mención Diseño Teatral' },
        { id: 662, nombre: 'Licenciado En Teatro Mención Dramaturgia' },
        { id: 663, nombre: 'Licenciado En Teatro Mención Docencia' },
        { id: 664, nombre: 'Licenciado En Teatro Mención Animación Teatral' },
        { id: 665, nombre: 'Licenciado En Relaciones Públicas' },
        {
          id: 668,
          nombre:
            'Técnico Superior En Mercadotecnia Mención Investigación De Mercado',
        },
        {
          id: 670,
          nombre: 'Técnico Superior En Mercadotecnia Mención Publicidad',
        },
        { id: 674, nombre: 'Ingeniero En Producción Industrial' },
        { id: 676, nombre: 'Técnico Superior En Educación Mención Historia' },
        { id: 678, nombre: 'Ingeniero Mecatrónico' },
        { id: 679, nombre: 'Licenciado En Citotecnología' },
        { id: 680, nombre: 'Licenciado En Entrenamiento Deportivo' },
        { id: 681, nombre: 'Licenciado En Actividad Física Y Salud' },
        { id: 682, nombre: 'Licenciado En Gestión Tecnológica Del Deporte' },
        { id: 683, nombre: 'Licenciado En Histotecnología' },
        {
          id: 686,
          nombre: 'Técnico Superior Universitario En Secretariado Ejecutivo',
        },
        { id: 688, nombre: 'Licenciado En Administración Pública' },
        { id: 689, nombre: 'Técnico Superior En Ciencias Criminales' },
        {
          id: 690,
          nombre: 'Ingeniero Electrónico Mención Automatización Y Control',
        },
        { id: 692, nombre: 'Licenciado En Terapia Ocupacional' },
        {
          id: 693,
          nombre: 'Licenciado En Educación Mención Técnica Industrial',
        },
        { id: 694, nombre: 'Licenciado En Actuación' },
        { id: 695, nombre: 'Técnico Superior En Contabilidad' },
        {
          id: 696,
          nombre: 'Técnico Superior En Administración De Hidrocarburos',
        },
        { id: 697, nombre: 'Técnico Superior Penitenciarista' },
        { id: 700, nombre: 'Profesor Especialidad:Lengua Y Literatura' },
        {
          id: 701,
          nombre: 'Técnico Superior En Administración De Mantenimiento',
        },
        { id: 702, nombre: 'Técnico Superior En Mecánica Automotriz' },
        {
          id: 703,
          nombre:
            'Licenciado En Ciencias Fiscales Menciones:Rentas,Aduanas Y Comercio Exterior,Finanzas Públicas',
        },
        { id: 704, nombre: 'Técnico Superior En Ciencias Agropecuarias' },
        { id: 707, nombre: 'Ingeniero De Producción En Agroecosistemas' },
        {
          id: 708,
          nombre: 'Técnico Superior En Rehabilitación Mención: Fisioterapia',
        },
        {
          id: 709,
          nombre:
            'Técnico Superior En Rehabilitación Mención: Terapia Ocupacional',
        },
        { id: 710, nombre: 'Técnico Superior En Seguridad Integral' },
        { id: 711, nombre: 'Profesor Especialidad:Educación Comercial' },
        {
          id: 713,
          nombre:
            'Licenciado En Educación Mención Educación Física,Deportes Y Recreación',
        },
        { id: 715, nombre: 'Técnico Superior En Gerencia Pública' },
        { id: 718, nombre: 'Ingeniero En Producción Animal' },
        {
          id: 719,
          nombre: 'Técnico Superior En Administración Mención Banca Y Finanzas',
        },
        {
          id: 720,
          nombre: 'Técnico Superior En Electrónica Mención Mantenimiento',
        },
        { id: 721, nombre: 'Técnico Superior En Contaduría Pública' },
        { id: 722, nombre: 'Licenciado En Artes Escénicas Mención Danza' },
        { id: 723, nombre: 'Licenciado En Desarrollo Humano' },
        {
          id: 724,
          nombre:
            'Licenciado En Educación Mención  Licenciado En Matemática Mención Docencia En Matemática',
        },
        {
          id: 725,
          nombre: 'Licenciado En Matemática Mención Docencia En Matemática',
        },
        { id: 727, nombre: 'Ingeniero Electrónico Mención Mecatrónica' },
        { id: 728, nombre: 'Licenciado En Administración Y Gestión Municipal' },
        { id: 729, nombre: 'Licenciado En Economía Social' },
        { id: 731, nombre: 'Licenciado En Administración De Desastres' },
        { id: 732, nombre: 'Técnico Superior En Mécanica Dental' },
        { id: 735, nombre: 'Técnico Superior En Producción Agroindustrial' },
        {
          id: 736,
          nombre:
            'Licenciado En Educación En Ciencias Sociales Mención Turismo',
        },
        { id: 737, nombre: 'Ingeniero Biomédico' },
        { id: 738, nombre: 'Licenciado En Desarrollo Empresarial' },
        { id: 739, nombre: 'Licenciado En Ciencias Ambientales' },
        {
          id: 740,
          nombre:
            'Licenciado En Conservación Y Restauración De Bienes Culturales Muebles',
        },
        { id: 741, nombre: 'Licenciado En Educación Mención Música' },
        {
          id: 742,
          nombre:
            'Licenciado En Educación Física,Recreación Y Entrenamiento Deportivo',
        },
        { id: 743, nombre: 'Técnico Superior En Entrenamiento Deportivo' },
        { id: 744, nombre: 'Licenciado En Estudios Políticos Y Gobierno' },
        { id: 745, nombre: 'Licenciado En Gestión De Salud Pública' },
        { id: 746, nombre: 'Licenciado En Informática Para La Gestión Social' },
        { id: 747, nombre: 'Licenciado En Agroecología' },
        { id: 748, nombre: 'Médico Integral Comunitario' },
        { id: 749, nombre: 'Ingeniero Petroquímico' },
        { id: 753, nombre: 'Licenciado En Estudios Políticos' },
        { id: 754, nombre: 'Licenciado En Ciencias Fiscales' },
        {
          id: 755,
          nombre:
            'Técnico Superior Universitario En Inspección De Salud Pública',
        },
        { id: 756, nombre: 'Ingeniero En Refinación Y Petroquímica' },
        {
          id: 757,
          nombre:
            'Licenciado En Educación Mención Ciencias Sociales,Área Geografía,Área Historia',
        },
        { id: 758, nombre: 'Técnico Superior En Agronomía' },
        { id: 760, nombre: 'Ingeniero Del Azúcar' },
        { id: 761, nombre: 'Ingeniero En Construcción Civil' },
        { id: 764, nombre: 'Técnico Superior Universitario En Mantenimiento' },
        { id: 769, nombre: 'Ingeniero En Mecánica' },
        {
          id: 785,
          nombre: 'Técnico Superior Universitario En Histotecnología',
        },
        {
          id: 786,
          nombre: 'Tecnico Superior Universitario En Aeronáutica Civil',
        },
        {
          id: 787,
          nombre: 'Técnico Superior Universitario En Aeronáutica Civil',
        },
        {
          id: 789,
          nombre:
            'Licenciado En Administración Mención Relaciones Industriales',
        },
        { id: 790, nombre: 'Licenciado En Fonoaudiología' },
        { id: 791, nombre: 'Ingeniero En Equipos Ferroviarios' },
        { id: 792, nombre: 'Ingeniero Rural' },
        {
          id: 794,
          nombre: 'Técnico Superior Universitario En Tecnología Forestal',
        },
        { id: 795, nombre: 'Licenciado En Comunicación' },
        {
          id: 797,
          nombre: 'Licenciado En Ciencias Y Artes Militares (Según Mención),',
        },
        {
          id: 798,
          nombre: 'Licenciado En Ciencias Del Fuego,Rescate Y Seguridad',
        },
        {
          id: 799,
          nombre:
            'Técnico Superior Universitario En Ciencias Del Fuego,Rescate Y Seguridad',
        },
        { id: 802, nombre: 'Ingeniero En Instrumentación Y Control' },
        { id: 804, nombre: 'Licenciado En Diseño Integral Comunitario' },
        { id: 808, nombre: 'Licenciado En Educación Para Las Artes' },
        {
          id: 813,
          nombre: 'Técnico Superior Universitario En Transporte Acuático',
        },
        { id: 814, nombre: 'Licenciado En Ciencias De La Información' },
        { id: 820, nombre: 'Técnico Superior En Electricidad' },
        { id: 821, nombre: 'Licenciado En Ciencias Forenses' },
        { id: 822, nombre: 'Licenciado En Radioterapia' },
        {
          id: 823,
          nombre:
            'Licenciado En Ciencias Y Artes Militares. Opción Guardia Nacional Bolivariana',
        },
        { id: 824, nombre: 'Técnico Superior Universitario En Enfermería' },
        { id: 826, nombre: 'Ingeniero En Electrónica' },
        { id: 827, nombre: 'Técnico Superior Universitario En Agronomía' },
        {
          id: 829,
          nombre:
            'Técnico Superior Universitario En Análisis Y Diseño De Sistemas',
        },
        {
          id: 830,
          nombre: 'Técnico Superior Universitario En Mecánica Dental',
        },
        { id: 832, nombre: 'Ingeniero En Agroecología' },
        {
          id: 834,
          nombre: 'Licenciado En Administración. Mención: Tributación',
        },
        { id: 844, nombre: 'Licenciado En Artes Audiovisuales' },
        { id: 848, nombre: 'Ingeniero En Hidrocarburos, Mención: Gas' },
        { id: 849, nombre: 'Técnico Superior Universitario En Danzas' },
        { id: 851, nombre: 'Técnico Superior Universitario En Informática' },
        {
          id: 853,
          nombre: 'Técnico Superior Universitario En Ortesis Y Prótesis',
        },
        { id: 857, nombre: 'Licenciado En Histocitotecnología' },
        { id: 858, nombre: 'Técnico Superior Universitario En Optometría' },
        {
          id: 872,
          nombre:
            'Técnico Superior Universitario En Prevención Y Salud En El Trabajo',
        },
        {
          id: 876,
          nombre: 'Técnico Superior Universitario En Servicios De Policía',
        },
        { id: 877, nombre: 'Ingeniero En Comunicaciones Y Electrónica' },
        { id: 878, nombre: 'Licenciado En Economía Política' },
        { id: 881, nombre: 'Ingeniero Militar Mención Geodesia' },
        { id: 883, nombre: 'Ingeniero Militar. Mención Armamento' },
        { id: 884, nombre: 'Ingeniero Militar Mención Mecánica Aeronaútica' },
        { id: 886, nombre: 'Ingeniero Militar Mención Sistemas' },
        { id: 887, nombre: 'Ingeniero Militar Mención Telecomunicaciones' },
        { id: 888, nombre: 'Ingeniero Militar. Mención Construcción' },
        { id: 889, nombre: 'Ingeniero Militar. Mención Electrónica' },
        {
          id: 890,
          nombre:
            'Licenciado En Administración Mención Recursos Materiales Y Financieros',
        },
        { id: 891, nombre: 'Maestro Especialidad Educación Integral' },
        {
          id: 896,
          nombre:
            'Licenciado En Administración Mención Organización Y Sistemas',
        },
        { id: 910, nombre: 'Ingeniería En Sistemas De Calidad Y Ambientes' },
        {
          id: 913,
          nombre:
            'Técnico Superior Universitario En Educación Mención Especial',
        },
        {
          id: 915,
          nombre: 'Técnico Superior Universitario En Penitenciarismo',
        },
        { id: 916, nombre: 'Licenciado En Penitenciarista' },
        {
          id: 918,
          nombre:
            'Licenciado En Ciencias Del Fuego Y Seguridad Contra Incendios',
        },
        {
          id: 920,
          nombre:
            'Técnico Superior Universitario En Protección Civil Y Administración De Desastres',
        },
        { id: 922, nombre: 'Técnologo En Agroecología' },
        {
          id: 925,
          nombre: 'Licenciado En Administración Mención Banca Y Seguros',
        },
        { id: 927, nombre: 'Técnico Superior Universitario En Automotriz' },
        {
          id: 929,
          nombre:
            'Técnico Superior Universitario En Enfermería Integral Comunitaria',
        },
        {
          id: 930,
          nombre: 'Licenciado En Enfermería Integral Comunitaria',
        },
        {
          id: 932,
          nombre:
            'Técnico Superior Universitario En Procesamiento Y Distribución De Alimentos',
        },
        {
          id: 936,
          nombre: 'Técnico Superior Universitario En Turismo Mención Hotelería',
        },
        {
          id: 937,
          nombre:
            'Licenciado En Educación Mención Idiomas Extranjeros Inglés Y Francés',
        },
        { id: 940, nombre: 'Licenciado En Administración Mención Turismo' },
        {
          id: 942,
          nombre: 'Licenciado En Comunicación Social Mención Audiovisual',
        },
        { id: 943, nombre: 'Técnico Superior Universitario En Catastro' },
        {
          id: 944,
          nombre: 'Licenciado En Seguridad Alimentaria Y Cultura Nutricional',
        },
        { id: 949, nombre: 'Técnico Superior Universitario En Música' },
        {
          id: 968,
          nombre: 'Técnico Superior Universitario En Producción Agroecológica',
        },
        { id: 970, nombre: 'Técnico Superior Universitario En Gas' },
        { id: 971, nombre: 'Técnico Superior Universitario En Petróleo' },
        {
          id: 972,
          nombre: 'Licenciado En Gestión Local Para El Desarrollo Social',
        },
        {
          id: 973,
          nombre: 'Licenciado En Gestión Social Para El Desarrollo Local',
        },
        {
          id: 980,
          nombre:
            'Profesor Especialidad: Educación Especial En Discapacidad Intelectual Y Del Desarrollo',
        },
        {
          id: 981,
          nombre:
            'Profesor Especialidad: Educación Especial Para Personas En Situación De Discapacidad',
        },
        {
          id: 982,
          nombre: 'Profesor Especialidad: Educación Especial Para Sordos',
        },
        { id: 983, nombre: 'Profesor Especialidad: Educación Inicial' },
        { id: 985, nombre: 'Ingeniero En Agroalimentación' },
        { id: 987, nombre: 'Profesor Especialidad: Educación Primaria' },
        {
          id: 988,
          nombre: 'Ingeniero En Seguridad Alimentaria Y Cultura Nutricional',
        },
        {
          id: 989,
          nombre: 'Profesor Especialidad: Inglés Como Lengua Extranjera',
        },
        {
          id: 990,
          nombre: 'Profesor Especialidad: Francés Como Lengua Extranjera',
        },
        { id: 991, nombre: 'Licenciado En Contaduría' },
        { id: 995, nombre: 'Licenciado En Gerontología' },
        {
          id: 998,
          nombre: 'Técnico Superior Universitario En Histocitotecnología',
        },
        { id: 1002, nombre: 'Técnico Superior En Artes Audiovisuales' },
        { id: 1004, nombre: 'Licenciado En Psicología Social' },
        { id: 1069, nombre: 'Licenciado En Optometría' },
        {
          id: 1071,
          nombre:
            'Licenciado En Protección Civil Y Administración De Desastres',
        },
        {
          id: 1079,
          nombre: 'Técnico Superior Universitaria En Producción Industrial',
        },
        {
          id: 1080,
          nombre: 'Técnico Superior Universitario Educación Para Las Artes ',
        },
        {
          id: 1081,
          nombre: 'Técnico Superior Universitario En Administración ',
        },
        {
          id: 1082,
          nombre: 'Técnico Superior Universitario En Agroalimentación ',
        },
        {
          id: 1083,
          nombre: 'Técnico Superior Universitario En Artes Audiovisuales ',
        },
        {
          id: 1084,
          nombre: 'Técnico Superior Universitario En Artes Plásticas ',
        },
        { id: 1085, nombre: 'Técnico Superior Universitario En Automotriz ' },
        {
          id: 1086,
          nombre: 'Técnico Superior Universitario En Calidad Y Ambiente',
        },
        {
          id: 1087,
          nombre:
            'Técnico Superior Universitario En Ciencias De La Información ',
        },
        {
          id: 1088,
          nombre: 'Técnico Superior Universitario En Construcción Civil',
        },
        {
          id: 1089,
          nombre: 'Técnico Superior Universitario En Contaduría Pública',
        },
        { id: 1090, nombre: 'Técnico Superior Universitario En Danzas ' },
        {
          id: 1091,
          nombre:
            'Técnico Superior Universitario En Diseño Integral Comunitario',
        },
        {
          id: 1092,
          nombre: 'Técnico Superior Universitario En Educación Especial ',
        },
        { id: 1094, nombre: 'Técnico Superior Universitario En Electrónica ' },
        { id: 1096, nombre: 'Técnico Superior Universitario En Fisioterapia' },
        {
          id: 1097,
          nombre: 'Técnico Superior Universitario En Fonoaudiología ',
        },
        { id: 1098, nombre: 'Técnico Superior Universitario En Geociencia ' },
        {
          id: 1099,
          nombre:
            'Técnico Superior Universitario En Higiene Y Seguridad Laboral',
        },
        { id: 1101, nombre: 'Técnico Superior Universitario En Informática ' },
        {
          id: 1102,
          nombre:
            'Técnico Superior Universitario En Instrumentación Y Control ',
        },
        { id: 1105, nombre: 'Técnico Superior Universitario En Música ' },
        {
          id: 1108,
          nombre:
            'Técnico Superior Universitario En Procesamiento Y Distribución De Alimentos ',
        },
        {
          id: 1109,
          nombre: 'Técnico Superior Universitario En Procesos Químicos ',
        },
        { id: 1111, nombre: 'Técnico Superior Universitario En Química' },
        {
          id: 1112,
          nombre:
            'Técnico Superior Universitario En Seguridad Alimentaria Y Cultura Nutricional',
        },
        { id: 1114, nombre: 'Técnico Superior Universitario En Teatro ' },
        {
          id: 1116,
          nombre: 'Técnico Superior Universitario En Transporte Ferroviario ',
        },
        {
          id: 1117,
          nombre: 'Técnico Superior Universitario En Órtesis Y Prótesis',
        },
        {
          id: 1118,
          nombre:
            'Técnico Superior Univesitario En Ciencias Del Fuego Y Seguridad Contra Incendios',
        },
        {
          id: 1119,
          nombre: 'Técnico Superior Univesitario En Investigación Penal',
        },
        { id: 1120, nombre: 'Técnico Superior En Penitenciarismo ' },
        {
          id: 1126,
          nombre:
            'Técnico Superior Universitario En Cerámica, En Metalurgia, En Polímeros',
        },
        { id: 1130, nombre: 'Titulo Temporal' },
        { id: 1131, nombre: 'Ingeniero En Transporte Ferroviario' },
        { id: 1133, nombre: 'Ingeniero En Materiales Industriales' },
        { id: 1134, nombre: 'Licenciado En Órtesis Y Prótesis' },
        { id: 1135, nombre: 'Licenciado En Gestión Policial' },
        { id: 1136, nombre: 'Licenciado En Investigación Penal' },
        {
          id: 1137,
          nombre:
            'Técnico Superior Universitario En Electricidad Mención Telecomunicaciones',
        },
        { id: 1138, nombre: 'Ingeniero En Automotríz' },
        { id: 1139, nombre: 'Ingeniero En Sistemas De Calidad Y Ambiente' },
        { id: 1140, nombre: 'Técnico Superior En Procesos Químicos' },
        { id: 1141, nombre: 'Licenciado En Educación Mención Agroecología' },
        {
          id: 1142,
          nombre: 'Ingeniero En Procesamiento Y Distribución De Alimentos',
        },
        { id: 1143, nombre: 'Ingeniero En Higiene Y Seguridad Laboral' },
        { id: 1144, nombre: 'Licenciado En Prevención Y  Salud En El Trabajo' },
        { id: 1145, nombre: 'Ingeniero En Geociencia' },
        { id: 1146, nombre: 'Técnico Superior Universitario En Turismo' },
        {
          id: 1147,
          nombre: 'Técnico Superior Universitario En Nutrición Y Dietética',
        },
        {
          id: 1148,
          nombre: 'Técnico Superior Universitario En Pesca Y Acuicultura',
        },
        { id: 1149, nombre: 'Ingeniero En Telemática' },
        { id: 1150, nombre: 'Médico Cirujano Militar' },
        {
          id: 1151,
          nombre:
            'Técnico Superior En Tecnología De Alimentos Mención Procesamiento Y Control De Calidad De Los Alimentos',
        },
        {
          id: 1152,
          nombre:
            'Técnico Superior Universitario En Educación Mención Educación Física Y Deportes',
        },
        {
          id: 1153,
          nombre:
            'Técnico Superior Universitario En Administración De Empresas Turísticas',
        },
        { id: 1154, nombre: 'Licenciado En Educación Inicial' },
        { id: 1155, nombre: 'Ingeniero En Hidrocarburos' },
        { id: 1156, nombre: 'Licenciado En Distribución Y Logística' },
        {
          id: 1157,
          nombre: 'Técnico Superior Universitario En Distribución Y Logística',
        },
        { id: 1158, nombre: 'Licenciado En Enfermería Militar' },
        { id: 1159, nombre: 'Licenciado En Radioimagenología' },
        { id: 1160, nombre: 'Ingeniero En Hidrocarburos, Mención: Petróleo' },
        {
          id: 1161,
          nombre: 'Técnico Superior Universitario En Radioimagenología',
        },
        { id: 1162, nombre: 'Profesor En Educación Química' },
        { id: 1163, nombre: 'Profesor De Educación En Biología' },
        { id: 1164, nombre: 'Profesor De Educación En Matemáticas' },
        { id: 1165, nombre: 'Licenciado En Geografía, Historia Y Ciudadanía' },
        { id: 1166, nombre: 'Licenciado En Educación En Lengua' },
        {
          id: 1167,
          nombre:
            'Licenciado En Educación En Idiomas Extranjeros, Mención; Inglés, Francés, Portugués',
        },
        {
          id: 1168,
          nombre:
            'Profesor En Educación Técnica Y Profesional. Mención Agropecuaria, Industrial, Comercio Y Servicios Administrativos, Promoción Social, Servicios De Salud, Arte Y Defensa',
        },
        { id: 1169, nombre: 'Licenciado En Educación En Física' },
        {
          id: 1170,
          nombre: 'Tsu En Aeronáutica Civil Mención: Búsqueda Y Salvamento',
        },
        {
          id: 1171,
          nombre:
            'Licenciado En Aeronática Civil Mención: Controlador De Tránsito Aéreo',
        },
        {
          id: 1172,
          nombre:
            'Licenciado En Aeronáutica Civil Mención: Información Y Comunicación Aeronáutica',
        },
        {
          id: 1173,
          nombre:
            'Licenciado  En Aeronáutica Civil Mención: Búsqueda Y Salvamento',
        },
        {
          id: 1174,
          nombre:
            'Ingeniero En Aeronáutica Civil Mención: Electrónica Para La Seguridad Aeronáutica',
        },
        {
          id: 1175,
          nombre: 'Ingeniero En Mantenimiento Mención: Máquinas Y Herramientas',
        },
        { id: 1176, nombre: 'Ingeniero En Sistemas De Potencia' },
        { id: 1177, nombre: 'Ingeniero En Redes Eléctricas' },
        { id: 1178, nombre: 'Ingeniero En Gestión De Mantenimiento Eléctrico' },
        { id: 1179, nombre: 'Tsu En Sistemas De Potencia' },
        { id: 1180, nombre: 'Tsu En Redes Eléctricas' },
        { id: 1181, nombre: 'Tsu En Gestión De Mantenimiento Eléctrico' },
        {
          id: 1182,
          nombre: 'Licenciado En Administración Para Los Medios Audiovisuales',
        },
        { id: 1183, nombre: 'Licenciado En Producción Audiovisual' },
        { id: 1184, nombre: 'Licenciado En Dirección Audiovisual' },
        { id: 1185, nombre: 'Licenciado En Dirección De Arte' },
        { id: 1186, nombre: 'Licenciado En Artes Escénicas' },
        { id: 1187, nombre: 'Ingeniero Audiovisual' },
        { id: 1188, nombre: 'Tsu En Agroecología' },
        { id: 1189, nombre: 'Licenciado En Administración Agropecuaria' },
        { id: 1190, nombre: 'Licenciado En Turismo Agroecológico' },
        { id: 1191, nombre: 'Licenciado En Botánica Tropical' },
        { id: 1192, nombre: 'Licenciado En Orientación' },
        { id: 1193, nombre: 'Licenciado En Estadísticas De La Salud' },
      ],
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
