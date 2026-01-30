import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Button } from '../button/button';
import { InputComponent } from '../input/input';
import { SelectComponent } from '../select/select';
import { AlertService } from '../../services/alert.service';
import { ApiResponse } from '../../models/api-response.model';
import { StudentDto } from '../../models/student.model';
import { CreateStudentRequest, UpdateStudentRequest } from '../../models/create-student-request.model';
import { StudentService } from '../../services/student.service';
import { CustomValidators } from '../../shared/validators/custom-validators';

@Component({
  selector: 'app-form-student',
  imports: [CommonModule, ReactiveFormsModule, Button, InputComponent, SelectComponent],
  templateUrl: './form-student.html',
  styleUrl: './form-student.scss',
})
export class FormStudentComponent implements OnInit {
  @Input() student: StudentDto | null = null;
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  isEditing = false;

  genderOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' }
    // { value: 'Other', label: 'Otro' }
  ];

  trainingLevelOptions = [
    { value: 'Beginner', label: 'Principiante' },
    { value: 'Intermediate', label: 'Intermedio' },
    { value: 'Advanced', label: 'Avanzado' }
  ];

  constructor(
    private fb: FormBuilder,
    private studentsService: StudentService,
    private alertService: AlertService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, CustomValidators.emailValidator(), Validators.maxLength(255)]],
      dateOfBirth: ['', [Validators.required, CustomValidators.pastDateValidator()]],
      gender: ['', [Validators.required]],
      heightCm: [null, [Validators.required, CustomValidators.heightValidator()]],
      weightKg: [null, [Validators.required, CustomValidators.weightValidator()]],
      trainingLevel: ['', [Validators.required]],
      phone: ['', [Validators.required, CustomValidators.phoneNumberValidator()]],
      country: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    if (this.student) {
      this.isEditing = true;
      this.loadStudentData();
    }
  }

  private loadStudentData(): void {
    if (!this.student) return;

    // Formatear la fecha para el input date
    const dateOfBirth = this.student.dateOfBirth ? new Date(this.student.dateOfBirth).toISOString().split('T')[0] : '';

    this.form.patchValue({
      name: this.student.userName,
      email: this.student.email,
      dateOfBirth: dateOfBirth,
      gender: this.student.gender,
      heightCm: this.student.heightCm,
      weightKg: this.student.weightKg,
      trainingLevel: this.student.trainingLevel,
      phone: this.student.phone,
      country: this.student.country
    });
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get dateOfBirthControl(): FormControl {
    return this.form.get('dateOfBirth') as FormControl;
  }

  get genderControl(): FormControl {
    return this.form.get('gender') as FormControl;
  }

  get heightCmControl(): FormControl {
    return this.form.get('heightCm') as FormControl;
  }

  get weightKgControl(): FormControl {
    return this.form.get('weightKg') as FormControl;
  }

  get trainingLevelControl(): FormControl {
    return this.form.get('trainingLevel') as FormControl;
  }

  get phoneControl(): FormControl {
    return this.form.get('phone') as FormControl;
  }

  get countryControl(): FormControl {
    return this.form.get('country') as FormControl;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting = true;

      if (this.isEditing && this.student) {
        // Actualizar estudiante existente
        const request: UpdateStudentRequest = {
          id: this.student.id,
          ...this.form.value,
          coachId: 0
        };

        this.studentsService.updateStudent(request).subscribe({
          next: (response: ApiResponse<StudentDto>) => {
            this.submitting = false;
            if (response.success) {
              this.alertService.showSuccess(response.message || 'Estudiante actualizado exitosamente');
              this.close.emit();
            } else {
              this.alertService.showError(response.message || 'Error al actualizar el estudiante');
            }
          },
          error: () => {
            this.submitting = false;
            this.alertService.showError('Error al actualizar el estudiante');
          }
        });
      } else {
        // Crear nuevo estudiante
        const request: CreateStudentRequest = {
          ...this.form.value,
          coachId: 0
        };

        this.studentsService.createStudent(request).subscribe({
          next: (response: ApiResponse<StudentDto>) => {
            this.submitting = false;
            if (response.success) {
              this.alertService.showSuccess(response.message || 'Estudiante creado exitosamente');
              this.close.emit();
            } else {
              this.alertService.showError(response.message || 'Error al crear el estudiante');
            }
          },
          error: () => {
            this.submitting = false;
            this.alertService.showError('Error al crear el estudiante');
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}