import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Button } from '../../components/button/button';
import { ApiResponse } from '../../models/api-response.model';
import { ExerciseSelectDto } from '../../models/exercise-select-dto.model';
import { TrainingTemplate, UpsertTrainingTemplate } from '../../models/training-template/training-template.model';
import { AlertService } from '../../services/alert.service';
import { ExerciseService } from '../../services/exercise.service';
import { TrainingTemplateService } from '../../services/training-template.service';
import { TemplateItems } from './template-items/template-items';

@Component({
  selector: 'app-training-templates',
  imports: [CommonModule, Button, TemplateItems],
  templateUrl: './training-templates.html',
  styleUrl: './training-templates.scss',
})
export class TrainingTemplates implements OnInit {
  templates = signal<TrainingTemplate[]>([]);
  availableExercises = signal<ExerciseSelectDto[]>([]);
  loading = signal<boolean>(false);
  loadingExercises = signal<boolean>(false);
  creatingTemplate = signal<boolean>(false);

  constructor(
    private trainingTemplateService: TrainingTemplateService,
    private exerciseService: ExerciseService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
    this.loadExercises();
  }

  loadTemplates(): void {
    this.loading.set(true);
    this.trainingTemplateService.getAll().subscribe({
      next: response => {
        this.templates.set(response.data ?? []);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.alertService.showError(this.getErrorMessage(err, 'Error al cargar las plantillas'));
      },
    });
  }

  loadExercises(): void {
    this.loadingExercises.set(true);
    this.exerciseService.getExercisesForSelect().subscribe({
      next: response => {
        this.availableExercises.set(response.data ?? []);
        this.loadingExercises.set(false);
      },
      error: () => {
        this.loadingExercises.set(false);
        this.alertService.showError('Error al cargar ejercicios');
      },
    });
  }

  newTemplate(): void {
    this.creatingTemplate.set(true);
  }

  cancelNewTemplate(): void {
    this.creatingTemplate.set(false);
  }

  createTemplate(request: UpsertTrainingTemplate): void {
    this.trainingTemplateService.create(request).subscribe({
      next: response => this.handleSaveSuccess(response, true),
      error: err => this.alertService.showError(this.getErrorMessage(err, 'Error al crear la plantilla')),
    });
  }

  updateTemplate(template: TrainingTemplate, request: UpsertTrainingTemplate): void {
    this.trainingTemplateService.update(template.id, request).subscribe({
      next: response => this.handleSaveSuccess(response),
      error: err => this.alertService.showError(this.getErrorMessage(err, 'Error al actualizar la plantilla')),
    });
  }

  deleteTemplate(template: TrainingTemplate): void {
    this.trainingTemplateService.delete(template.id).subscribe({
      next: response => {
        this.alertService.showSuccess(response.message || 'Plantilla eliminada correctamente');
        this.loadTemplates();
      },
      error: err => this.alertService.showError(this.getErrorMessage(err, 'Error al eliminar la plantilla')),
    });
  }

  private handleSaveSuccess(response: ApiResponse<number | object>, wasNew = false): void {
    this.alertService.showSuccess(response.message || 'Plantilla guardada correctamente');
    if (wasNew) {
      this.creatingTemplate.set(false);
    }
    this.loadTemplates();
  }

  private getErrorMessage(err: any, fallback: string): string {
    return err?.error?.message || err?.error?.errors?.[0] || fallback;
  }
}
