import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class SelectComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: { value: any; label: string }[] = [];
  @Input() control: FormControl | null = null;

  get hasError(): boolean {
    return !!(this.control?.invalid && this.control?.touched);
  }

  get errorMessage(): string {
    if (!this.control || !this.control.errors || !this.control.touched) {
      return '';
    }

    const errors = this.control.errors;

    if (errors['required']) {
      return 'Este campo es obligatorio';
    }

    return '';
  }
}