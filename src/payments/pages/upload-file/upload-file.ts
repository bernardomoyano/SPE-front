import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService, CloudinaryUploadResponse } from '../../services/cloudinary.service';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.scss'
})
export class UploadFile {
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  uploading = signal(false);
  uploadResult = signal<CloudinaryUploadResponse | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private cloudinaryService: CloudinaryService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set('Solo se permiten imágenes (JPG, PNG, WEBP, GIF) o PDF.');
      this.selectedFile.set(null);
      this.previewUrl.set(null);
      return;
    }

    this.errorMessage.set(null);
    this.uploadResult.set(null);
    this.selectedFile.set(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.previewUrl.set(null);
    }
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.errorMessage.set(null);

    this.cloudinaryService.uploadFile(file).subscribe({
      next: (res) => {
        this.uploadResult.set(res);
        this.uploading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al subir el archivo. Revisá la configuración de Cloudinary.');
        console.error(err);
        this.uploading.set(false);
      }
    });
  }

  reset(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.uploadResult.set(null);
    this.errorMessage.set(null);
  }
}
