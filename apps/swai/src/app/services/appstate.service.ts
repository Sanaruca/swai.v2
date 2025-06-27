import { Injectable, makeStateKey } from '@angular/core';
import { InstitucionDTO } from '@swai/core';

const INSTITUCION = makeStateKey<InstitucionDTO>('INSTITUCION')

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  institucion!: InstitucionDTO;
  

}
