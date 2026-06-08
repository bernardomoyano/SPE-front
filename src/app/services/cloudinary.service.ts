import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  original_filename: string;
  bytes: number;
}

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly uploadUrl = environment.cloudinary.uploadUrl
    || `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    return this.http.post<CloudinaryUploadResponse>(this.uploadUrl, formData);
  }
}
