import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, Button],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class ConfirmationComponent {
  @Input() type: 'success' | 'danger' = 'danger';
  @Input() title: string = 'Confirmar Acción';
  @Input() message: string = '¿Estás seguro de que quieres continuar?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() loading: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get confirmVariant(): string {
    return this.type === 'success' ? 'primary' : 'danger';
  }

  get containerClass(): string {
    return `confirmation confirmation--${this.type}`;
  }

  get iconClass(): string {
    return this.type === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle';
  }
}