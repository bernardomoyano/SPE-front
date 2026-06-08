import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningWithMicrocyclesDto } from '../../models/planning-with-microcycles.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-card-planifications',
  imports: [CommonModule],
  templateUrl: './card-planifications.html',
  styleUrl: './card-planifications.scss',
})
export class CardPlanificationsComponent {
  @Input() planning!: PlanningWithMicrocyclesDto;
  @Output() delete = new EventEmitter<PlanningWithMicrocyclesDto>();
  @Output() viewDetails = new EventEmitter<PlanningWithMicrocyclesDto>();
  @Output() goToPayment = new EventEmitter<PlanningWithMicrocyclesDto>();
  @Output() uploadEvidence = new EventEmitter<PlanningWithMicrocyclesDto>();

  constructor(private authService: AuthService) {}

  get isStudent(): boolean {
    return this.authService.getUserRole() === 'STUDENT';
  }

  get hasPaidPurchase(): boolean {
    return this.planning?.purchase?.status === 'PAID';
  }

  get hasPendingManualPurchase(): boolean {
    return this.planning?.purchase?.status === 'PENDING_PAYMENT'
      && this.planning?.purchase?.paymentMethodSelected === 'MANUAL';
  }

  get hasManualPurchaseUnderReview(): boolean {
    return this.planning?.purchase?.status === 'UNDER_REVIEW'
      && this.planning?.purchase?.paymentMethodSelected === 'MANUAL';
  }

  onDelete(): void {
    this.delete.emit(this.planning);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.planning);
  }

  onGoToPayment(): void {
    this.goToPayment.emit(this.planning);
  }

  onUploadEvidence(): void {
    this.uploadEvidence.emit(this.planning);
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'active': 'Activo',
      'paused': 'Pausado',
      'finished': 'Finalizado'
    };
    return labels[status] || status;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'training': 'Entrenamiento',
      'nutrition': 'Nutrición',
      'complete': 'Completo'
    };
    return labels[type] || type;
  }
}

