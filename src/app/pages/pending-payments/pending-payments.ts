import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiResponse } from '../../models/api-response.model';
import { ManualPaymentEvidence, ManualPaymentReviewItem } from '../../models/plan-purchase/manual-payment-review.model';
import { AlertService } from '../../services/alert.service';
import { PlanPurchaseService } from '../../services/plan-purchase.service';
import { StorageService } from '../../services/storage.service';
import { Button } from "../../components/button/button";
import { DateArgPipe } from '../../shared/pipes/date-arg.pipe';
import { MoneyArgPipe } from '../../shared/pipes/money-arg.pipe';

@Component({
  selector: 'app-pending-payments',
  imports: [CommonModule, Button, DateArgPipe, MoneyArgPipe],
  templateUrl: './pending-payments.html',
  styleUrl: './pending-payments.scss',
})
export class PendingPayments implements OnInit {
  loading = signal(false);
  reviewing = signal(false);
  payments = signal<ManualPaymentReviewItem[]>([]);
  selectedEvidence = signal<ManualPaymentEvidence | null>(null);
  selectedPayment = signal<ManualPaymentReviewItem | null>(null);
  reviewAction = signal<'approve' | 'reject' | null>(null);
  reviewComment = signal('');

  constructor(
    private planPurchaseService: PlanPurchaseService,
    private storageService: StorageService,
    private alertService: AlertService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadPendingPayments();
  }

  loadPendingPayments(): void {
    const userData = this.storageService.getUserData();
    const payeeId = userData?.userId?.toString();

    if (!payeeId) {
      this.alertService.showError('No se pudo obtener el coach actual');
      return;
    }

    this.loading.set(true);
    this.planPurchaseService.getManualReviewQueue(payeeId).subscribe({
      next: (response: ApiResponse<ManualPaymentReviewItem[]>) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.payments.set(response.data);
        } else {
          this.alertService.showError(response.message || 'Error al cargar pagos pendientes');
        }
      },
      error: () => {
        this.loading.set(false);
        this.alertService.showError('Error de conexión al cargar pagos pendientes');
      }
    });
  }

  getActiveEvidence(payment: ManualPaymentReviewItem): ManualPaymentEvidence | null {
    return payment.evidences?.find(evidence => evidence.isActive) ?? payment.evidences?.[0] ?? null;
  }

  openEvidence(payment: ManualPaymentReviewItem): void {
    const evidence = this.getActiveEvidence(payment);
    if (!evidence) {
      this.alertService.showError('Este pago no tiene comprobante para visualizar');
      return;
    }

    this.selectedEvidence.set(evidence);
  }

  closeEvidence(): void {
    this.selectedEvidence.set(null);
  }

  openReview(payment: ManualPaymentReviewItem, action: 'approve' | 'reject'): void {
    this.selectedPayment.set(payment);
    this.reviewAction.set(action);
    this.reviewComment.set('');
  }

  closeReview(): void {
    if (this.reviewing()) return;
    this.selectedPayment.set(null);
    this.reviewAction.set(null);
    this.reviewComment.set('');
  }

  updateComment(event: Event): void {
    this.reviewComment.set((event.target as HTMLTextAreaElement).value);
  }

  submitReview(): void {
    const payment = this.selectedPayment();
    const action = this.reviewAction();
    const userData = this.storageService.getUserData();
    const reviewedBy = userData?.name || userData?.userName || `coach_${userData?.userId}`;

    if (!payment || !action || !reviewedBy) return;

    const request = {
      reviewedBy,
      comment: this.reviewComment().trim()
    };

    this.reviewing.set(true);
    const result = action === 'approve'
      ? this.planPurchaseService.approveManualPayment(payment.paymentId, request)
      : this.planPurchaseService.rejectManualPayment(payment.paymentId, request);

    result.subscribe({
      next: (response) => {
        this.reviewing.set(false);
        if (response.success) {
          this.alertService.showSuccess(action === 'approve' ? 'Pago aprobado correctamente' : 'Pago rechazado correctamente');
          this.closeReview();
          this.loadPendingPayments();
        } else {
          this.alertService.showError(response.message || 'No se pudo revisar el pago');
        }
      },
      error: () => {
        this.reviewing.set(false);
        this.alertService.showError('Error de conexión al revisar el pago');
      }
    });
  }

  isPdf(evidence: ManualPaymentEvidence | null): boolean {
    if (!evidence) return false;
    return evidence.fileType === 'application/pdf' || evidence.fileName.toLowerCase().endsWith('.pdf');
  }

  getSafeEvidenceUrl(evidence: ManualPaymentEvidence | null): SafeResourceUrl | null {
    return evidence ? this.sanitizer.bypassSecurityTrustResourceUrl(evidence.fileUrl) : null;
  }
}

