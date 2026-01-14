import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() control: FormControl | null = null;
  @Input() backendError: string = '';

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get inputType() {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }

  get hasToggle(): boolean {
    return this.type === 'password';
  }

  get hasError(): boolean {
    return !!(this.backendError || (this.control?.invalid && this.control?.touched));
  }

  get errorMessage(): string {
    // Priorizar errores del backend
    if (this.backendError) {
      return this.backendError;
    }

    if (!this.control || !this.control.errors || !this.control.touched) {
      return '';
    }

    const errors = this.control.errors;

    // Errores estándar
    if (errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }

    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }

    // Errores personalizados
    if (errors['invalidName']) {
      return 'Solo se permiten letras y espacios';
    }

    if (errors['invalidEmail']) {
      return 'Ingresa un correo electrónico válido';
    }

    if (errors['invalidPhone']) {
      return 'Ingresa un teléfono válido (7-15 dígitos)';
    }

    // Errores de contraseña
    if (errors['minLength']) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }

    if (errors['maxLength']) {
      return 'La contraseña no debe superar 16 caracteres';
    }

    if (errors['noUpperCase']) {
      return 'Debe contener al menos una letra mayúscula';
    }

    if (errors['noLowerCase']) {
      return 'Debe contener al menos una letra minúscula';
    }

    if (errors['noSpecialChar']) {
      return 'Debe contener al menos un carácter especial';
    }

    if (errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }
}
