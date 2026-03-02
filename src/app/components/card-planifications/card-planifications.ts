import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningWithMicrocyclesDto } from '../../models/planning-with-microcycles.model';

@Component({
  selector: 'app-card-planifications',
  imports: [CommonModule],
  templateUrl: './card-planifications.html',
  styleUrl: './card-planifications.scss',
})
export class CardPlanificationsComponent {
  @Input() planning!: PlanningWithMicrocyclesDto;
  @Output() edit = new EventEmitter<PlanningWithMicrocyclesDto>();
  @Output() delete = new EventEmitter<PlanningWithMicrocyclesDto>();
  @Output() viewDetails = new EventEmitter<PlanningWithMicrocyclesDto>();

  onEdit(): void {
    this.edit.emit(this.planning);
  }

  onDelete(): void {
    this.delete.emit(this.planning);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.planning);
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
