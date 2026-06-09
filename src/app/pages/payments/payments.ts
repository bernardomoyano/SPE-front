import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';
import { PlanPurchaseHistoryItem } from '../../models/plan-purchase.model';
import { AlertService } from '../../services/alert.service';
import { PlanPurchaseService } from '../../services/plan-purchase.service';
import { StorageService } from '../../services/storage.service';
import { Button } from '../../components/button/button';
import { DateArgPipe } from '../../shared/pipes/date-arg.pipe';
import { MoneyArgPipe } from '../../shared/pipes/money-arg.pipe';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, Button, DateArgPipe, MoneyArgPipe],
  templateUrl: './payments.html',
  styleUrl: './payments.scss',
})
export class Payments implements OnInit {
  loading = signal(false);
  payments = signal<PlanPurchaseHistoryItem[]>([]);
  selectedPayment = signal<PlanPurchaseHistoryItem | null>(null);
  role = signal('');

  constructor(
    private planPurchaseService: PlanPurchaseService,
    private storageService: StorageService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    const userData = this.storageService.getUserData();
    const userId = userData?.userId;
    const role = userData?.roleName;

    if (!userId || !role) {
      this.alertService.showError('No se pudo obtener el usuario actual');
      return;
    }

    this.role.set(role);
    this.loading.set(true);

    this.planPurchaseService.getHistory(userId, role).subscribe({
      next: (response: ApiResponse<PlanPurchaseHistoryItem[]>) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.payments.set(response.data);
        } else {
          this.alertService.showError(response.message || 'Error al cargar pagos');
        }
      },
      error: () => {
        this.loading.set(false);
        this.alertService.showError('Error de conexión al cargar pagos');
      }
    });
  }

  isCoach(): boolean {
    return this.role() === 'COACH';
  }

  getTitle(): string {
    return this.isCoach() ? 'Pagos recibidos' : 'Mis pagos';
  }

  getCounterpartyLabel(): string {
    return this.isCoach() ? 'Alumno' : 'Coach';
  }

  getCounterpartyName(payment: PlanPurchaseHistoryItem): string {
    return this.isCoach()
      ? payment.studentName || `Alumno ${payment.studentId}`
      : payment.coachName || `Coach ${payment.coachId}`;
  }

  openDetail(payment: PlanPurchaseHistoryItem): void {
    this.selectedPayment.set(payment);
  }

  closeDetail(): void {
    this.selectedPayment.set(null);
  }

  canViewDocument(payment: PlanPurchaseHistoryItem | null): boolean {
    return !!payment?.paymentId;
  }

  getDocumentButtonLabel(_payment: PlanPurchaseHistoryItem | null): string {
    return 'Ver comprobante';
  }

  openDocument(payment: PlanPurchaseHistoryItem | null): void {
    if (!payment?.paymentId) {
      this.alertService.showError('Este pago no tiene comprobante disponible');
      return;
    }

    if (payment.paymentMethodSelected === 'MERCADO_PAGO') {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/comprobantes/mercado-pago', payment.paymentId])
      );
      window.open(url, '_blank');
      return;
    }

    const popup = window.open('', '_blank');

    this.planPurchaseService.getPaymentDocumentLink(payment.paymentId).subscribe({
      next: (response: ApiResponse<{ url?: string }>) => {
        if (response.success && response.data?.url) {
          if (popup) {
            popup.location.href = response.data.url;
          } else {
            window.open(response.data.url, '_blank');
          }
        } else {
          popup?.close();
          this.alertService.showError(response.message || 'Este pago no tiene comprobante disponible');
        }
      },
      error: () => {
        popup?.close();
        this.alertService.showError('Error de conexión al cargar el comprobante');
      }
    });
  }

  formatStatus(status: string): string {
    const labels: Record<string, string> = {
      PENDING_PAYMENT: 'Pendiente',
      UNDER_REVIEW: 'Bajo revisión',
      PAID: 'Pagado',
      PAYMENT_REJECTED: 'Rechazado',
      CANCELLED: 'Cancelado',
      EXPIRED: 'Expirado'
    };

    return labels[status] || status;
  }

  formatPaymentMethod(method: string): string {
    const labels: Record<string, string> = {
      MERCADO_PAGO: 'Mercado Pago',
      MANUAL: 'Manual'
    };

    return labels[method] || method;
  }
}
