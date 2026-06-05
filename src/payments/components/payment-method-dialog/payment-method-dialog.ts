import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService, CloudinaryUploadResponse } from '../../services/cloudinary.service';

type PaymentView = 'selection' | 'manual';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

@Component({
  selector: 'app-payment-method-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method-dialog.html',
  styleUrl: './payment-method-dialog.scss',
})
export class PaymentMethodDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() mercadoPagoSelected = new EventEmitter<void>();
  @Output() voucherUploaded = new EventEmitter<CloudinaryUploadResponse>();

  view: PaymentView = 'selection';
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  uploading = signal(false);
  uploadError = signal<string | null>(null);
  uploadSuccess = signal(false);

  constructor(private cloudinaryService: CloudinaryService) {}

  get title(): string {
    return this.view === 'selection' ? 'Elija su forma de pago' : 'Datos para transferencia';
  }

  get canSubmit(): boolean {
    return this.selectedFile() !== null && !this.uploading();
  }

  selectMercadoPago(): void {
    this.mercadoPagoSelected.emit();
  }

  selectManual(): void {
    this.view = 'manual';
  }

  goBack(): void {
    this.view = 'selection';
    this.resetUpload();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!ALLOWED_TYPES.includes(file.type)) {
      this.uploadError.set('Solo se permiten imágenes (JPG, PNG, WEBP, GIF) o PDF.');
      this.selectedFile.set(null);
      this.previewUrl.set(null);
      input.value = '';
      return;
    }

    this.uploadError.set(null);
    this.uploadSuccess.set(false);
    this.selectedFile.set(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.previewUrl.set(null);
    }
  }

  submitVoucher(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.uploadError.set(null);

    this.cloudinaryService.uploadFile(file).subscribe({
      next: (res) => {
        this.uploading.set(false);
        this.uploadSuccess.set(true);
        // this.voucherUploaded.emit(res);
        console.log('res clod', res);
        
      },
      error: () => {
        this.uploading.set(false);
        this.uploadError.set('Error al subir el comprobante. Intentá de nuevo.');
      }
    });
  }

  removeFile(): void {
    this.resetUpload();
  }

  private resetUpload(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.uploadError.set(null);
    this.uploadSuccess.set(false);
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('payment-dialog-overlay')) {
      this.onClose();
    }
  }
}
