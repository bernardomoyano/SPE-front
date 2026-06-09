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
  @Input() step: string | number | null = null;

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

    // Errores estÃ¡ndar
    if (errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (errors['maxlength']) {
      return `MÃ¡ximo ${errors['maxlength'].requiredLength} caracteres`;
    }

    if (errors['min']) {
      return `El valor debe ser mayor o igual a ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `El valor debe ser menor o igual a ${errors['max'].max}`;
    }

    if (errors['pattern']) {
      return 'Formato inválido';
    }

    if (errors['minlength']) {
      return `MÃ­nimo ${errors['minlength'].requiredLength} caracteres`;
    }

    // Errores personalizados
    if (errors['invalidName']) {
      return 'Solo se permiten letras y espacios';
    }

    if (errors['invalidEmail']) {
      return 'Ingresa un correo electrÃ³nico vÃ¡lido';
    }

    if (errors['invalidPhone']) {
      return 'Ingresa un telÃ©fono vÃ¡lido (7-15 dÃ­gitos)';
    }

    // Errores de contraseÃ±a
    if (errors['minLength']) {
      return 'La contraseÃ±a debe tener al menos 8 caracteres';
    }

    if (errors['maxLength']) {
      return 'La contraseÃ±a no debe superar 16 caracteres';
    }

    if (errors['noUpperCase']) {
      return 'Debe contener al menos una letra mayÃºscula';
    }

    if (errors['noLowerCase']) {
      return 'Debe contener al menos una letra minÃºscula';
    }

    if (errors['noSpecialChar']) {
      return 'Debe contener al menos un carÃ¡cter especial';
    }

    if (errors['passwordMismatch']) {
      return 'Las contraseÃ±as no coinciden';
    }
    // Errores de altura
    if (errors['minHeight']) {
      return 'La altura no puede ser negativa o cero';
    }

    if (errors['maxHeight']) {
      return 'La altura debe tener como mÃ¡ximo 3 cifras (999 cm)';
    }

    // Errores de peso
    if (errors['minWeight']) {
      return 'El peso no puede ser negativo o cero';
    }

    if (errors['maxWeight']) {
      return 'El peso mÃ¡ximo es 999.99 kg';
    }

    if (errors['maxDecimals']) {
      return 'El peso puede tener como mÃ¡ximo 2 decimales';
    }

    // Errores de telÃ©fono
    if (errors['notNumeric']) {
      return 'Solo se permiten nÃºmeros';
    }

    if (errors['minPhoneLength']) {
      return 'El telÃ©fono debe tener entre 7 y 15 dÃ­gitos';
    }

    if (errors['maxPhoneLength']) {
      return 'El telÃ©fono debe tener entre 7 y 15 dÃ­gitos';
    }

    // Errores de fecha
    if (errors['futureDate']) {
      return 'La fecha debe ser anterior a hoy';
    }
    return '';
  }
}

