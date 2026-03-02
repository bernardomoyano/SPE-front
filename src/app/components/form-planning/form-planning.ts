import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Button } from '../button/button';
import { InputComponent } from '../input/input';
import { SelectComponent } from '../select/select';
import { AlertService } from '../../services/alert.service';
import { PlanificationsService } from '../../services/planifications.service';
import { CreatePlanningRequest } from '../../models/create-planning-request.model';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-form-planning',
  imports: [CommonModule, ReactiveFormsModule, Button, InputComponent, SelectComponent],
  templateUrl: './form-planning.html',
  styleUrl: './form-planning.scss',
})
export class FormPlanningComponent implements OnInit {
  @Input() studentId: number | null = null;
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;

  statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'paused', label: 'Pausado' },
    { value: 'finished', label: 'Finalizado' }
  ];

  typeOptions = [
    { value: 'training', label: 'Entrenamiento' },
    { value: 'nutrition', label: 'Nutrición' },
    { value: 'complete', label: 'Completo' }
  ];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private planificationsService: PlanificationsService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.maxLength(255)]],
      goals: ['', [Validators.maxLength(1000)]],
      phase: ['', [Validators.maxLength(255)]],
      startDate: ['', [Validators.required]],
      durationWeeks: [null, [Validators.required, Validators.min(1), Validators.max(104)]],
      status: ['active', [Validators.required]],
      type: ['', [Validators.required]],
      notes: ['', [Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    // Si hay un studentId pre-cargado, podemos hacer algo con él si es necesario
    if (this.studentId) {
      console.log('StudentId recibido:', this.studentId);
    }
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get goalsControl(): FormControl {
    return this.form.get('goals') as FormControl;
  }

  get phaseControl(): FormControl {
    return this.form.get('phase') as FormControl;
  }

  get startDateControl(): FormControl {
    return this.form.get('startDate') as FormControl;
  }

  get durationWeeksControl(): FormControl {
    return this.form.get('durationWeeks') as FormControl;
  }

  get statusControl(): FormControl {
    return this.form.get('status') as FormControl;
  }

  get typeControl(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get notesControl(): FormControl {
    return this.form.get('notes') as FormControl;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting = true;
      const formData = this.form.value;
      
      const planningData: CreatePlanningRequest = {
        studentId: this.studentId || 0,
        coachId: 0, // Se obtendrá del servicio/token
        name: formData.name,
        goals: formData.goals,
        phase: formData.phase,
        startDate: new Date(formData.startDate),
        durationWeeks: formData.durationWeeks,
        status: formData.status,
        type: formData.type,
        notes: formData.notes
      };

      console.log('Datos de la planificación:', planningData);

      this.planificationsService.createPlanning(planningData).subscribe({
        next: (response: ApiResponse<number>) => {
          this.submitting = false;
          if (response.success) {
            this.alertService.showSuccess(response.message || 'Planificación creada exitosamente');
            this.close.emit();
          } else {
            this.alertService.showError(response.message || 'Error al crear la planificación');
          }
        },
        error: () => {
          this.submitting = false;
          this.alertService.showError('Error de conexión. Verifica tu conexión a internet.');
        }
      });
    } else {
      this.alertService.showError('Por favor completa todos los campos requeridos');
      this.markFormGroupTouched(this.form);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
