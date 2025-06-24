import { isPlatformServer } from '@angular/common';
import { inject, Injectable, makeStateKey, PLATFORM_ID, REQUEST_CONTEXT, TransferState } from '@angular/core';
import { InstitucionDTO } from '@swai/core';

const INSTITUCION = makeStateKey<InstitucionDTO>('INSTITUCION')

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private request_context = inject<{ institucion: InstitucionDTO }>(REQUEST_CONTEXT, { optional: true })
  private transfer_state = inject(TransferState)
  private platformId = inject(PLATFORM_ID)

  institucion!: InstitucionDTO;
  constructor() {

    if (isPlatformServer(this.platformId)) {
      console.log('\n\n\n\nInstitucion desde TransferState server:', this.request_context!.institucion);
      this.institucion = this.request_context!.institucion
      this.transfer_state.set(INSTITUCION, this.institucion)
    } else {
      console.log('\n\n\n\nInstitucion desde TransferState:', this.transfer_state.get(INSTITUCION, null));
      this.institucion = (this.transfer_state.get(INSTITUCION, null)!)
      
    }
  }

}
