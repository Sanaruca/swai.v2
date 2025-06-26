import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppStateService } from './services/appstate.service';

@Component({
  imports: [RouterModule, ButtonModule],
  selector: 'aw-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  title = 'webapp';
  app = inject(AppStateService);

}
