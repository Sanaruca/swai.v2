import {
    AdministrativoDTO,
    AdministrativoSchemaDTO,
    CedulaSchema,
    EmpleadoDTO,
    EmpleadoSchemaDTO,
    ProfesorDTO,
    ProfesorSchemaDTO,
    SwaiError,
    SwaiErrorCode,
    TIPO_DE_EMPLEADO,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { parse, parser } from 'valibot';

export const obtener_empleado = admin_procedure
  .input(parser(CedulaSchema))
  .query<EmpleadoDTO | ProfesorDTO | AdministrativoDTO>(
    async ({ ctx, input }) => {

      const empleado = await ctx.prisma.empleados.findUnique({
        where: {
          cedula: input,
        },
        include: {
          personas: {
            include: {
              estados_civiles: true,
              tipos_de_sangre: true,
            },
          },
          centros_de_votacion: true,
          tipos_de_empleado: true,
          administrativos: {
            include: {
              titulos_de_pregrado: true,
            },
          },
          profesores: {
            include: {
              titulos_de_pregrado: true,
              especialidades: true,
              planteles_educativos: true,
            },
          },
        },
      });

      if (!empleado)
        throw new SwaiError({
          codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
          mensaje: 'Empleado no encontrado',
        });

      const base = {
        ...empleado.personas,
        estado_civil: empleado.personas.estados_civiles,
        tipo_de_sangre: empleado.personas.tipos_de_sangre,
        ...empleado,
        tipo_de_empleado: empleado.tipos_de_empleado,
        centro_de_votacion: empleado.centros_de_votacion,
      };

      if (empleado.tipo_de_empleado === TIPO_DE_EMPLEADO.ADMINISTRATIVO) {
        return parse(AdministrativoSchemaDTO, {
          ...base,
          titulo_de_pregrado: empleado.administrativos?.titulos_de_pregrado,
        });
      }

      if (empleado.tipo_de_empleado === TIPO_DE_EMPLEADO.DOCENTE) {
        return parse(ProfesorSchemaDTO, {
          ...base,
          titulo_de_pregrado: empleado.profesores?.titulos_de_pregrado,
          especialidad: empleado.profesores?.especialidades,
          plantel_de_dependencia: empleado.profesores?.planteles_educativos,
        });
      }

      return parse(EmpleadoSchemaDTO, base);
    }
  );
