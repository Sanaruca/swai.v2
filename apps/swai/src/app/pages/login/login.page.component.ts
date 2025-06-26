import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { AppStateService } from '../../services/appstate.service';

@Component({
  selector: 'aw-login.page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './login.page.component.html',
  styleUrl: './login.page.component.scss',
})
export class LoginPageComponent {

  /* ............................... injectables .............................. */
  private fb = inject(FormBuilder)
  private auth = inject(AuthService)
  private app = inject(AppStateService)


  loading = false;
  loginForm!: FormGroup;


  async ngOnInit() {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    });
  }

  onSubmit(): void {

    if (this.loading) return

    if (this.loginForm.valid) {
      this.loading = true      
      this.auth.login(this.loginForm.value).finally(()=> {
        this.loading = false
      })

    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
