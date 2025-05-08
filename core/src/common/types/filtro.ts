import {
    any,
    array,
    BaseIssue,
    BaseSchema,
    boolean,
    custom,
    date,
    enum_,
    never,
    number,
    object,
    parse,
    picklist,
    safeParse,
    string,
} from 'valibot';

export enum SelectableCondicion {
  IGUAL = 'IGUAL',
  DISTINTO = 'DISTINTO',
}

export enum StringCondicion {
  IGUAL = 'IGUAL',
  DISTINTO = 'DISTINTO',
  CONTIENE = 'CONTIENE',
//   MAYOR_QUE = 'MAYOR_QUE',
//   MENOR_QUE = 'MENOR_QUE',
}

export enum NumberCondicion {
  IGUAL = 'IGUAL',
  DISTINTO = 'DISTINTO',
  MAYOR_QUE = 'MAYOR_QUE',
  MENOR_QUE = 'MENOR_QUE',
}

export enum BooleanCondicion {
  IGUAL = 'IGUAL',
  DISTINTO = 'DISTINTO',
}

export enum DateCondicion {
  IGUAL = 'IGUAL',
  DISTINTA = 'DISTINTA',
  DESPUES_DE = 'DESPUES_DE',
  ANTES_DE = 'ANTES_DE',
}

export type Condicion =
  | StringCondicion
  | NumberCondicion
  | BooleanCondicion
  | DateCondicion
  | SelectableCondicion;

export type Selectable<T = unknown> = Array<T>;

export enum TIPO_DE_CONDICION {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  SELECTABLE = 'selectable',
}

export type TipoDeCampo<T = unknown> =
  | string
  | number
  | boolean
  | Date
  | Selectable<T>;

export interface Filtro<C extends string = string, T extends TipoDeCampo = TipoDeCampo> {
  campo: C;
  condicion: T extends string
    ? StringCondicion
    : T extends number
    ? NumberCondicion
    : T extends boolean
    ? BooleanCondicion
    : T extends Date
    ? DateCondicion
    : T extends Date
    ? SelectableCondicion
    : Condicion;
  valor: T;
}



const generateBaseFiltroSchema = <S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(tipo?: TIPO_DE_CONDICION, selectable?: S) => object({
  campo: string(),
  condicion: tipo === TIPO_DE_CONDICION.STRING
    ? enum_(StringCondicion)
    : tipo === TIPO_DE_CONDICION.NUMBER
    ? enum_(NumberCondicion)
    : tipo === TIPO_DE_CONDICION.BOOLEAN
    ? enum_(BooleanCondicion)
    : tipo === TIPO_DE_CONDICION.DATE
    ? enum_(DateCondicion)
    : tipo === TIPO_DE_CONDICION.SELECTABLE
    ? enum_(SelectableCondicion)
    : never(),

  valor:
    tipo === TIPO_DE_CONDICION.STRING
      ? string()
      : tipo === TIPO_DE_CONDICION.NUMBER
      ? number()
      : tipo === TIPO_DE_CONDICION.BOOLEAN
      ? boolean()
      : tipo === TIPO_DE_CONDICION.DATE
      ? date()
      : tipo === TIPO_DE_CONDICION.SELECTABLE
      ? array(selectable ?? any())
      : never(),
})

export const FiltroSchema = custom<Filtro>(
    (value) => {
        if (typeof value !== 'object' || value === null) return false;
        if (!('campo' in value) || typeof value.campo !== 'string') return false;
        if (!('condicion' in value)) return false;
        if (!('valor' in value)) return false;


        const tipo = typeof value.valor === 'string'
            ? TIPO_DE_CONDICION.STRING
            : typeof value.valor === 'number'
            ? TIPO_DE_CONDICION.NUMBER
            : typeof value.valor === 'boolean'
            ? TIPO_DE_CONDICION.BOOLEAN
            : value.valor instanceof Date
            ? TIPO_DE_CONDICION.DATE
            : Array.isArray(value.valor)
            ? TIPO_DE_CONDICION.SELECTABLE
            : undefined;

        if (!tipo) return false;

        const schema = generateBaseFiltroSchema(tipo);
        const result = safeParse(schema,value);

        if (!result.success) return false;


        return true;
    }, 
    'Filtro no es valido'
)

interface GenerateFiltroSchemaParams<C extends string = string> {
    campos_validos: C[]
}
export const generateFiltroSchema = <C extends string>({campos_validos}: GenerateFiltroSchemaParams<C>) => custom<Filtro<C>>((value)=>{

    const filtro = parse(FiltroSchema, value)

    parse(picklist(campos_validos), filtro.campo)

    return true

}, 'Filtro no es valido')