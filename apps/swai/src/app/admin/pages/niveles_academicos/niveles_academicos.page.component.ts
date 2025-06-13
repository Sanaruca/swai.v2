import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FastLinkComponent
} from '../../../admin/components';
import { PensumDTO } from '@swai/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { EditableNivelAcademicoComponent } from './components/editable_nivel_academico/editable_nivel_academico.component';


@Component({
  selector: 'aw-niveles-academicos.page',
  imports: [
    CommonModule,
    FastLinkComponent,
    TagModule,
    RouterLink,
    EditableNivelAcademicoComponent
  ],
  templateUrl: './niveles_academicos.page.component.html',
  styleUrl: './niveles_academicos.page.component.scss',
})
export class NivelesAcademicosPageComponent {
  private route = inject(ActivatedRoute);
  protected pensum: PensumDTO[] = this.route.snapshot.data['pensum'];





}
