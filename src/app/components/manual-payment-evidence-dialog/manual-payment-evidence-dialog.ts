import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CloudinaryService } from '../../services/cloudinary.service';
import { PlanPurchaseService } from '../../services/plan-purchase.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

@Component({
  selector: 'app-manual-payment-evidence-dialog',
  imports: [CommonModule],
  templateUrl: './manual-payment-evidence-dialog.html',
  styleUrl: './manual-payment-evidence-dialog.scss',
})
export class ManualPaymentEvidenceDialogComponent {
  @Input({ required: true }) paymentId!: string;
  @Input({ required: true }) uploadedBy!: string;
  @Output() close = new EventEmitter<void>();
  @Output() uploaded = new EventEmitter<void>();

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  error = signal<string | null>(null);
  uploading = signal(false);

  constructor(
    private cloudinaryService: CloudinaryService,
    private planPurchaseService: PlanPurchaseService
  ) {}

  get canSubmit(): boolean {
    return !!this.selectedFile() && !this.uploading();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      this.error.set('Solo se permiten imágenes JPG, PNG, WEBP, GIF o PDF.');
      this.clearFile(input);
      return;
    }

    this.error.set(null);
    this.selectedFile.set(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.previewUrl.set(null);
    }
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.error.set(null);
  }

  submit(): void {
    const file = this.selectedFile();
    if (!file || !this.paymentId) return;

    this.uploading.set(true);
    this.error.set(null);

    this.cloudinaryService.uploadFile(file).subscribe({
      next: (cloudinaryResponse) => {
        this.planPurchaseService.uploadManualEvidence(this.paymentId, {
          fileUrl: cloudinaryResponse.secure_url,
          fileName: file.name || cloudinaryResponse.original_filename,
          fileType: file.type || `${cloudinaryResponse.resource_type}/${cloudinaryResponse.format}`,
          fileSize: file.size || cloudinaryResponse.bytes,
          uploadedBy: this.uploadedBy
        }).subscribe({
          next: () => {
            this.uploading.set(false);
            this.uploaded.emit();
          },
          error: () => {
            this.uploading.set(false);
            this.error.set('El archivo se subió, pero no se pudo registrar el comprobante. Intentá de nuevo.');
          }
        });
      },
      error: () => {
        this.uploading.set(false);
        this.error.set('No se pudo subir el archivo a Cloudinary. Revisá la configuración e intentá de nuevo.');
      }
    });
  }

  onClose(): void {
    if (this.uploading()) return;
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('manual-evidence-dialog')) {
      this.onClose();
    }
  }

  private clearFile(input: HTMLInputElement): void {
    input.value = '';
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }
}
