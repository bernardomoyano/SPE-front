import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';
import { MercadoPagoReceipt } from '../../models/plan-purchase.model';
import { AlertService } from '../../services/alert.service';
import { PlanPurchaseService } from '../../services/plan-purchase.service';
import { DateArgPipe } from '../../shared/pipes/date-arg.pipe';
import { MoneyArgPipe } from '../../shared/pipes/money-arg.pipe';

@Component({
  selector: 'app-payment-document',
  imports: [CommonModule, DateArgPipe, MoneyArgPipe],
  templateUrl: './payment-document.html',
  styleUrl: './payment-document.scss',
})
export class PaymentDocument implements OnInit {
  loading = signal(false);
  receipt = signal<MercadoPagoReceipt | null>(null);

  constructor(
    private route: ActivatedRoute,
    private planPurchaseService: PlanPurchaseService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const paymentId = this.route.snapshot.paramMap.get('paymentId');

    if (!paymentId) {
      this.alertService.showError('No se encontró el pago');
      return;
    }

    this.loadMercadoPagoReceipt(paymentId);
  }

  loadMercadoPagoReceipt(paymentId: string): void {
    this.loading.set(true);

    this.planPurchaseService.getMercadoPagoReceipt(paymentId).subscribe({
      next: (response: ApiResponse<MercadoPagoReceipt>) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.receipt.set(response.data);
        } else {
          this.alertService.showError(response.message || 'No se pudo cargar el comprobante de Mercado Pago');
        }
      },
      error: () => {
        this.loading.set(false);
        this.alertService.showError('Error de conexión al cargar el comprobante de Mercado Pago');
      }
    });
  }
}
