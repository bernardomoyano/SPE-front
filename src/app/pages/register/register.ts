import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputComponent as Input } from "../../components/input/input";
import { Left } from "./left/left";
import { Button } from "../../components/button/button";
import { Logo } from "../../shared/components/logo/logo";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CustomValidators } from '../../shared/validators/custom-validators';

@Component({
  selector: 'app-register',
  imports: [RouterLink, Input, Left, Button, Logo, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          CustomValidators.emailValidator()
        ]
      ],
      password: [
        '',
        [Validators.required]
      ]
    });
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Datos del formulario:', this.loginForm.value);
      console.log('Email:', this.loginForm.value.email);
      console.log('Contraseña:', this.loginForm.value.password);
    } else {
      console.log('Formulario inválido');
    }
  }
}
