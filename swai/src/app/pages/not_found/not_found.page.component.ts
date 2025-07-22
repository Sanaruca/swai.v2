import { Component, inject, OnInit, RESPONSE_INIT } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'aw-not-found.page',
  imports: [CommonModule],
  templateUrl: './not_found.page.component.html',
  styleUrl: './not_found.page.component.css',
})
export class NotFoundPageComponent implements OnInit {
  private ssr_response = inject(RESPONSE_INIT);

  ngOnInit() {
    if (this.ssr_response) {
      this.ssr_response.status = 404;
    }
  }
}
