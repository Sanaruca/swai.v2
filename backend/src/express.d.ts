declare namespace Express {
  export interface User {
    id: string;
    nombre_de_usuario: string;
    cedula: number;
    rol: string;
  }

  export interface Request {
    user?: User; // Propiedad opcional de tipo User
  }
}
