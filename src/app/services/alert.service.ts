import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showSuccess(title: string, callback?: () => void): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: title,
      timer: 1500,
      showConfirmButton: false,
      toast: true
    }).then(() => {
      if (callback) {
        callback();
      }
    });
  }

  showError(title: string, callback?: () => void): void {
    Swal.fire({
      position: 'top-end',
      title: title,
      icon: 'error',
      showConfirmButton: false,
      timer: 1500,
      toast: true
    }).then(() => {
      if (callback) {
        callback();
      }
    });
  }
}