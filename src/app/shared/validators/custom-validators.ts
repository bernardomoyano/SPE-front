import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validador para nombres: solo letras y espacios
   */
  static nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      const valid = nameRegex.test(control.value);
      return valid ? null : { invalidName: true };
    };
  }

  /**
   * Validador para email: formatos comunes (@gmail.com, @outlook.com, etc.)
   */
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }

  /**
   * Validador para contraseña: 8-16 caracteres, al menos 1 mayúscula, 1 minúscula y 1 carácter especial
   */
  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const password = control.value;
      const errors: ValidationErrors = {};

      // Verificar longitud
      if (password.length < 8) {
        errors['minLength'] = true;
      }

      if (password.length > 16) {
        errors['maxLength'] = true;
      }

      // Verificar mayúscula
      if (!/[A-Z]/.test(password)) {
        errors['noUpperCase'] = true;
      }

      // Verificar minúscula
      if (!/[a-z]/.test(password)) {
        errors['noLowerCase'] = true;
      }

      // Verificar carácter especial
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors['noSpecialChar'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Validador para teléfono: solo números, 7-15 dígitos
   */
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const phoneRegex = /^\d{7,15}$/;
      const valid = phoneRegex.test(control.value);
      return valid ? null : { invalidPhone: true };
    };
  }

  /**
   * Validador para confirmar que las contraseñas coincidan
   * Debe aplicarse al FormGroup, no al control individual
   */
  static passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField);
      const confirmPassword = formGroup.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validador para fecha de nacimiento: debe ser anterior a hoy
   */
  static pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return inputDate < today ? null : { futureDate: true };
    };
  }

  /**
   * Validador para altura en centímetros: máximo 3 dígitos, mayor a 0
   */
  static heightValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const height = Number(control.value);

      if (height <= 0) {
        return { minHeight: true };
      }

      if (height > 999) {
        return { maxHeight: true };
      }

      return null;
    };
  }

  /**
   * Validador para peso en kg: máximo 999.99, mayor a 0
   */
  static weightValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const weight = Number(control.value);

      if (weight <= 0) {
        return { minWeight: true };
      }

      if (weight > 999.99) {
        return { maxWeight: true };
      }

      // Validar máximo 2 decimales
      const decimalPart = control.value.toString().split('.')[1];
      if (decimalPart && decimalPart.length > 2) {
        return { maxDecimals: true };
      }

      return null;
    };
  }

  /**
   * Validador para teléfono: solo números, entre 7 y 15 dígitos
   */
  static phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneValue = control.value.toString().trim();

      // Validar que solo contenga números
      const numericRegex = /^[0-9]+$/;
      if (!numericRegex.test(phoneValue)) {
        return { notNumeric: true };
      }

      // Validar longitud entre 7 y 15 dígitos
      if (phoneValue.length < 7) {
        return { minPhoneLength: true };
      }

      if (phoneValue.length > 15) {
        return { maxPhoneLength: true };
      }

      return null;
    };
  }
}
