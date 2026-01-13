import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Button } from '../button/button';
import { InputComponent } from '../input/input';
import { SelectComponent } from '../select/select';
import { ExerciseService } from '../../services/exercise.service';
import { MuscleGroupsService } from '../../services/muscle-groups.service';
import { AlertService } from '../../services/alert.service';
import { ApiResponse } from '../../models/api-response.model';
import { MuscleGroup } from '../../models/muscle-group.model';
import { CreateExerciseRequest } from '../../models/create-exercise-request.model';

@Component({
  selector: 'app-form-exercise',
  imports: [CommonModule, ReactiveFormsModule, Button, InputComponent, SelectComponent],
  templateUrl: './form-exercise.html',
  styleUrl: './form-exercise.scss',
})
export class FormExerciseComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  muscleGroups = signal<MuscleGroup[]>([]);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private muscleGroupsService: MuscleGroupsService,
    private alertService: AlertService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(1000)]],
      linkVideo: ['', [Validators.maxLength(1000)]],
      muscleGroupId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMuscleGroups();
  }

  loadMuscleGroups(): void {
    this.loading.set(true);
    this.muscleGroupsService.getMuscleGroups().subscribe({
      next: (response: ApiResponse<MuscleGroup[]>) => {
        if (response.success && response.data) {
          this.muscleGroups.set(response.data);
        } else {
          this.alertService.showError(response.message || 'Error al cargar grupos musculares');
        }
        this.loading.set(false);
      },
      error: () => {
        this.alertService.showError('Error al cargar grupos musculares');
        this.loading.set(false);
      }
    });
  }

  get muscleGroupOptions() {
    return this.muscleGroups().map(group => ({
      value: group.id,
      label: group.name
    }));
  }

  get muscleGroupControl(): FormControl {
    return this.form.get('muscleGroupId') as FormControl;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting.set(true);
      const request: CreateExerciseRequest = {
        ...this.form.value,
        coachId: 0
      };
      
      this.exerciseService.createExercise(request).subscribe({
        next: (response: ApiResponse<any>) => {
          this.submitting.set(false);
          if (response.success) {
            this.alertService.showSuccess(response.message || 'Ejercicio creado exitosamente');
            this.close.emit();
          } else {
            this.alertService.showError(response.message || 'Error al crear el ejercicio');
          }
        },
        error: () => {
          this.submitting.set(false);
          this.alertService.showError('Error al crear el ejercicio');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get linkVideoControl(): FormControl {
    return this.form.get('linkVideo') as FormControl;
  }

  onCancel(): void {
    this.close.emit();
  }
}