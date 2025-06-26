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
  

}
