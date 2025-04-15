import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESTADOS_CIVILES, PersonaDTO } from '@swai/core';
import { CampoValorComponent } from './components/campo_valor.component';
import { SeccionCampoValorComponent } from './components/seccion_campo_valor.component';
import { AvatarModule } from 'primeng/avatar';
import { SexoTagComponent } from '../../components';

@Component({
  selector: 'aw-perfil',
  imports: [
    CommonModule,
    CampoValorComponent,
    SeccionCampoValorComponent,
    AvatarModule,
    SexoTagComponent,
  ],
  templateUrl: './perfil.layout.component.html',
  styleUrl: './perfil.layout.component.scss',
})
export class PerfilLayoutComponent {
  /* ............................... constantes ............................... */
  ESTADOS_CIVILES = ESTADOS_CIVILES;

  @Input() persona!: PersonaDTO;
  @ContentChild('headerRight', { static: true })
  headerRightTemplate!: TemplateRef<any>;
  @ContentChild('tags', { static: true }) tagsTemplate!: TemplateRef<any>;

  get nombre(): string {
    return (
      this.persona.nombres.split(' ').at(0) +
      ' ' +
      this.persona.apellidos.split(' ').at(0)
    );
  }
  get iniciales(): string {
    return this.nombre
      .split(' ')
      .map((it) => it.charAt(0))
      .join('')
      .toUpperCase();
  }
}
