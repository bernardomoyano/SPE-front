import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { InputComponent as Input } from "../../components/input/input";
import { Left } from "../register/left/left";
import { Button } from "../../components/button/button";
import { Logo } from "../../shared/components/logo/logo";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coach } from '../../services/coach';
import { CoachRegisterRequest } from '../../models/coach.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register-coach',
  imports: [RouterLink, Input, Left, Button, Logo],
  templateUrl: './register-coach.html',
  styleUrl: './register-coach.scss',
})
export class RegisterCoach {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  constructor(
    private fb: FormBuilder,
    private coachService: Coach,
    private alertService: AlertService,
    private router: Router
  ){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      speciality: ['', Validators.required],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      roleId: [2] 
    });
  }

   onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const data: CoachRegisterRequest = this.registerForm.value;

      this.coachService.registerCoach(data).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.alertService.showSuccess('El coach fue registrado correctamente', () => {
              this.registerForm.reset();
              this.router.navigate(['/login']);
            });
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.isLoading = false;
          // Habilitar controles del formulario
          Object.keys(this.registerForm.controls).forEach(key => {
            this.registerForm.get(key)?.enable();
          });
          this.alertService.showError('No se pudo completar el registro. Intenta nuevamente');
        }
      });
    }
  }
}
