import { Component, Input, Output, EventEmitter, signal, OnInit, OnChanges, SimpleChanges, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { ExerciseService } from '../../services/exercise.service';
import { TrainingSessionService } from '../../services/microcycle.service';
import { ExerciseGroupService } from '../../services/exercise-group.service';
import { AlertService } from '../../services/alert.service';
import { ExerciseSelectDto } from '../../models/exercise-select-dto.model';
import { TrainingSession } from '../../models/training-session/training-session.model';
import { ExerciseSession } from '../../models/training-session/exercise-session.model';
import { CreateExerciseGroupDto } from '../../models/exerciseGroup/create-exercise-group-dto.model';
import {
  FormExerciseGroupComponent,
  ExerciseGroupType,
  ExerciseGroupFormData,
} from '../form-exercise-group/form-exercise-group';
import { ExerciseGroupDto } from '../../models/exerciseGroup/exercise-group-dto.model';
import { TrainingTemplate, TrainingTemplateSummary } from '../../models/training-template/training-template.model';
import { TrainingTemplateService } from '../../services/training-template.service';

export interface TrainingSessionData {
  id?: number;
  heating: string;
  title: string;
  notes: string;
  numberSession: number;
}

export interface ExerciseRow {
  id?: number;
  exerciseId: number | null;
  sets: number;
  reps: string;
  restSec: number;
  isEditing: boolean;
  sortOrder: number;
  isSelected?: boolean;
  group?: (ExerciseGroupDto & { isTemplateGroup?: boolean }) | null;
}

// ─── Display row types (rendered table rows) ─────────────────────────────────
export interface ExerciseDisplayRow {
  type: 'exercise';
  exercise: ExerciseRow;
  exerciseIndex: number;
  isInGroup: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

export interface GroupCardRow {
  type: 'group-card';
  group: ExerciseGroupDto;
  exercises: Array<{ exercise: ExerciseRow; exerciseIndex: number }>;
}

export type DisplayRow = ExerciseDisplayRow | GroupCardRow;

@Component({
  selector: 'app-session-item',
  imports: [CommonModule, FormsModule, FormExerciseGroupComponent, Button],
  templateUrl: './session-item.html',
  styleUrl: './session-item.scss',
})
export class SessionItemComponent implements OnInit, OnChanges {
  @Input() session!: TrainingSessionData;
  @Input() sessionNumber: number = 1;
  @Input() microcycleId!: number;
  @Output() save = new EventEmitter<TrainingSessionData>();
  @Output() delete = new EventEmitter<void>();

  isCollapsed = signal<boolean>(false);
  isEditing = signal<boolean>(true); // Nuevo siempre en modo edición

  // Valores temporales mientras se edita
  editedSession = signal<TrainingSessionData>({
    heating: '',
    title: '',
    notes: '',
    numberSession: 1,
  });

  // Lista de ejercicios disponibles desde el backend
  availableExercises = signal<ExerciseSelectDto[]>([]);
  loadingExercises = signal<boolean>(true);

  // Lista de ejercicios de esta sesión
  exercises = signal<ExerciseRow[]>([]);

  selectionMode = signal<boolean>(false);

  
  showGroupForm = signal<boolean>(false);
  groupType = signal<ExerciseGroupType | null>(null);
  savingGroup = signal<boolean>(false);
  showTemplateDialog = signal<boolean>(false);
  loadingTemplates = signal<boolean>(false);
  loadingTemplateDetails = signal<boolean>(false);
  templateSummaries = signal<TrainingTemplateSummary[]>([]);

  // Selected exercises (computed)
  selectedExercises = computed(() => this.exercises().filter((ex) => ex.isSelected));

  // Tipo de grupo según cantidad seleccionada
  currentGroupType = computed<ExerciseGroupType | null>(() => {
    const count = this.selectedExercises().length;
    if (count === 2) return 'superserie';
    if (count === 3) return 'triserie';
    if (count > 3)  return 'circuito';
    return null;
  });

  // Label del botón de acción de grupo
  groupButtonLabel = computed<string>(() => {
    const labels: Record<ExerciseGroupType, string> = {
      superserie: 'Crear Superserie',
      triserie:   'Crear Triserie',
      circuito:   'Crear Circuito',
    };
    const type = this.currentGroupType();
    return type ? labels[type] : '';
  });

  // ─── Display rows: agrupa ejercicios en tarjetas de grupo
  displayRows = computed<DisplayRow[]>(() => {
    const exercises = this.exercises();
    const processedGroups = new Set<number>();
    const rows: DisplayRow[] = [];

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      const groupId = ex.group?.id;

      if (!groupId) {
        rows.push({
          type: 'exercise',
          exercise: ex,
          exerciseIndex: i,
          isInGroup: false,
          isFirstInGroup: false,
          isLastInGroup: false,
        });
      } else if (!processedGroups.has(groupId)) {
        processedGroups.add(groupId);
        const groupExercises = exercises
          .map((e, idx) => ({ exercise: e, exerciseIndex: idx }))
          .filter(({ exercise }) => exercise.group?.id === groupId);
        rows.push({
          type: 'group-card',
          group: ex.group!,
          exercises: groupExercises,
        });
      }
      // Si el grupo ya fue procesado, omitir (ya está en rows)
    }

    return rows;
  });

  constructor(
    private exerciseService: ExerciseService,
    private trainingSessionService: TrainingSessionService,
    private exerciseGroupService: ExerciseGroupService,
    private trainingTemplateService: TrainingTemplateService,
    private alertService: AlertService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia el microcycleId (cambio de semana) resetear y recargar
    if (changes['microcycleId'] && !changes['microcycleId'].firstChange) {
      this.resetState();
      if (this.microcycleId) {
        this.loadMicrocycleData();
      }
    }
  }

  ngOnInit(): void {
    // Cargar datos del microciclo si existe el ID
    if (this.microcycleId) {
      this.loadMicrocycleData();
    }

    // Si la sesión tiene datos, no está en modo edición
    if (this.session.title || this.session.heating || this.session.notes) {
      this.isEditing.set(false);
    }
    this.editedSession.set({ ...this.session });

    // Cargar ejercicios disponibles
    this.loadExercises();
  }

  private resetState(): void {
    this.exercises.set([]);
    this.selectionMode.set(false);
    this.showGroupForm.set(false);
    this.showTemplateDialog.set(false);
    this.groupType.set(null);
    this.isEditing.set(false);
    this.editedSession.set({ ...this.session });
  }

  private loadMicrocycleData(): void {
    this.trainingSessionService.getMicrocycleById(this.microcycleId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const microcycle = response.data;

          // Buscar la sesión correspondiente por numberSession
          const trainingSession = microcycle.trainingSessions.find(
            ts => ts.numberSession === this.session.numberSession
          );

          if (trainingSession) {
            
            // Precargar datos de la sesiÃ³n
            const sessionData: TrainingSessionData = {
              id: trainingSession.id,
              heating: trainingSession.heating || '',
              title: trainingSession.title,
              notes: trainingSession.notes || '',
              numberSession: trainingSession.numberSession
            };

            this.session = sessionData;
            this.editedSession.set({ ...sessionData });

            // Precargar ejercicios de la sesiÃ³n
            if (trainingSession.exerciseSessions && trainingSession.exerciseSessions.length > 0) {
              const exerciseRows: ExerciseRow[] = trainingSession.exerciseSessions.map(es => ({
                id: es.id,
                exerciseId: es.exerciseId,
                sets: es.sets,
                reps: es.reps,
                restSec: es.restSec,
                isEditing: false,
                sortOrder: es.sortOrder,
                group: es.group ? es.group : null
              }));
              this.exercises.set(exerciseRows);
            }

            // Si hay datos cargados, no mostrar en modo ediciÃ³n
            if (trainingSession.title || trainingSession.heating || trainingSession.notes) {
              this.isEditing.set(false);
            }
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del microciclo:', error);
      }
    });
  }

  private loadExercises(): void {
    this.loadingExercises.set(true);
    this.exerciseService.getExercisesForSelect().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.availableExercises.set(response.data);
        }
        this.loadingExercises.set(false);
      },
      error: () => {
        this.loadingExercises.set(false);
        console.error('Error al cargar ejercicios');
      }
    });
  }

  toggleCollapse(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  enableEdit(): void {
    this.editedSession.set({ ...this.session });
    this.isEditing.set(true);
  }

  saveChanges(): void {
    this.session = { ...this.editedSession() };
    this.save.emit(this.session);
    this.isEditing.set(false);
  }

  cancelChanges(): void {
    this.editedSession.set({ ...this.session });
    this.isEditing.set(false);
  }

  onDelete(): void {
    this.delete.emit();
  }

  updateField(field: keyof TrainingSessionData, value: string | number): void {
    this.editedSession.set({
      ...this.editedSession(),
      [field]: value
    });
  }

  // Métodos para ejercicios
  addExercise(): void {
    const newExercise: ExerciseRow = {
      exerciseId: null,
      sets: 3,
      reps: '10',
      restSec: 60,
      isEditing: true,
      sortOrder: this.exercises().length + 1
    };
    this.exercises.set([...this.exercises(), newExercise]);
  }

  updateExercise(index: number, field: keyof ExerciseRow, value: any): void {
    const exercises = [...this.exercises()];
    exercises[index] = {
      ...exercises[index],
      [field]: value
    };
    this.exercises.set(exercises);
  }

  saveExercise(index: number): void {
    const exercises = [...this.exercises()];
    exercises[index] = {
      ...exercises[index],
      isEditing: false
    };
    this.exercises.set(exercises);
  }

  editExercise(index: number): void {
    const exercises = [...this.exercises()];
    exercises[index] = {
      ...exercises[index],
      isEditing: true
    };
    this.exercises.set(exercises);
  }

  deleteExercise(index: number): void {
    const exercises = [...this.exercises()];
    exercises.splice(index, 1);
    
    // Renumerar sortOrder
    exercises.forEach((ex, idx) => {
      ex.sortOrder = idx + 1;
    });
    
    this.exercises.set(exercises);
  }

  getExerciseName(exerciseId: number | null): string {
    if (!exerciseId) return 'Sin seleccionar';
    const exercise = this.availableExercises().find(ex => ex.id === exerciseId);
    return exercise?.name || 'Desconocido';
  }

  // ─── Selección múltiple de ejercicios ─────────────────────────────────────

  toggleExerciseSelection(index: number): void {
    const exercises = [...this.exercises()];
    exercises[index] = {
      ...exercises[index],
      isSelected: !exercises[index].isSelected,
    };
    this.exercises.set(exercises);
    // Auto-apagar modo selección si no quedan seleccionados
    if (!exercises.some(ex => ex.isSelected)) {
      this.selectionMode.set(false);
    }
  }

  clearSelection(): void {
    this.exercises.set(
      this.exercises().map(ex => ({ ...ex, isSelected: false })),
    );
    this.selectionMode.set(false);
  }

  /** Activa el modo selección al hacer clic en una fila (no en botones) */
  onExerciseRowClick(index: number): void {
    if (!this.selectionMode()) {
      this.selectionMode.set(true);
    }
    this.toggleExerciseSelection(index);
  }

  /** Devuelve el label legible para un tipo de grupo (viene como string del backend) */
  getGroupTypeLabel(type: string): string {
    const map: Record<string, string> = {
      superserie: 'Superserie',
      superset: 'Superserie',
      triserie:   'Triserie',
      triset: 'Triserie',
      circuito:   'Circuito',
      circuit: 'Circuito',
    };
    return map[type?.toLowerCase()] ?? type;
  }

  trackByDisplayRow(_: number, row: DisplayRow): string {
    if (row.type === 'exercise') return `ex-${(row as ExerciseDisplayRow).exerciseIndex}`;
    return `group-${(row as GroupCardRow).group.id}`;
  }

  ungroupExercises(groupId: number): void {
    this.exerciseGroupService.deleteExerciseGroup(groupId).subscribe({
      next: (response) => {
        this.alertService.showSuccess(response.message || 'Grupo eliminado correctamente');
        this.loadMicrocycleData();
      },
      error: (err) => {
        const message: string =
          err?.error?.message ||
          err?.error?.errors?.[0] ||
          'Error al desagrupar los ejercicios';
        this.alertService.showError(message);
      },
    });
  }

  openGroupForm(): void {
    const type = this.currentGroupType();
    if (!type) return;
    this.groupType.set(type);
    this.showGroupForm.set(true);
  }

  onCancelGroup(): void {
    this.showGroupForm.set(false);
    this.groupType.set(null);
  }

  onSaveGroup(formData: ExerciseGroupFormData): void {
    const type = this.currentGroupType();
    if (!type || !this.session.id) return;

    const selectedIds = this.selectedExercises()
      .filter(ex => ex.id != null)
      .map(ex => ex.id!);

    if (selectedIds.length < 2) return;

    const dto: CreateExerciseGroupDto = {
      trainingSessionId: this.session.id,
      rounds: formData.rounds,
      restBetweenRoundsSec: formData.restBetweenRoundsSec,
      exerciseSessionIds: selectedIds,
    };
    

    this.savingGroup.set(true);
    this.exerciseGroupService.createExerciseGroup(dto).subscribe({
      next: (response) => {
        this.savingGroup.set(false);
        this.showGroupForm.set(false);
        this.clearSelection();
        this.alertService.showSuccess(response.message || 'Grupo creado correctamente');
        this.loadMicrocycleData();
      },
      error: (err) => {
        this.savingGroup.set(false);
        const message: string =
          err?.error?.message ||
          err?.error?.errors?.[0] ||
          'Error al crear el grupo de ejercicios';
        this.alertService.showError(message);
      },
    });
  }


  openTemplateDialog(): void {
    this.showTemplateDialog.set(true);

    if (this.templateSummaries().length > 0) {
      return;
    }

    this.loadingTemplates.set(true);
    this.trainingTemplateService.getSummaries().subscribe({
      next: response => {
        this.templateSummaries.set(response.data ?? []);
        this.loadingTemplates.set(false);
      },
      error: err => {
        this.loadingTemplates.set(false);
        this.alertService.showError(this.getErrorMessage(err, 'Error al cargar las plantillas'));
      },
    });
  }

  closeTemplateDialog(): void {
    this.showTemplateDialog.set(false);
  }

  loadTemplate(templateId: number): void {
    this.loadingTemplateDetails.set(true);
    this.trainingTemplateService.getById(templateId).subscribe({
      next: response => {
        if (response.data) {
          this.applyTemplate(response.data);
          this.showTemplateDialog.set(false);
          this.alertService.showSuccess('Plantilla cargada correctamente');
        }
        this.loadingTemplateDetails.set(false);
      },
      error: err => {
        this.loadingTemplateDetails.set(false);
        this.alertService.showError(this.getErrorMessage(err, 'Error al cargar la plantilla'));
      },
    });
  }

  private applyTemplate(template: TrainingTemplate): void {
    this.editedSession.set({
      ...this.editedSession(),
      heating: template.heating || '',
      title: template.title,
      notes: template.notes || '',
    });

    const groups = new Map<number, ExerciseGroupDto & { isTemplateGroup?: boolean }>();
    template.groups.forEach(group => {
      groups.set(group.id, {
        id: group.id,
        trainingSessionId: this.session.id ?? 0,
        type: group.type,
        name: group.name,
        sortOrder: group.sortOrder,
        rounds: group.rounds,
        restBetweenExercisesSec: group.restBetweenExercisesSec,
        restBetweenRoundsSec: group.restBetweenRoundsSec,
        isTemplateGroup: true,
      });
    });

    this.exercises.set(template.exercises.map((exercise, index) => ({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      restSec: exercise.restSec,
      isEditing: false,
      sortOrder: exercise.sortOrder || index + 1,
      group: this.resolveTemplateGroup(exercise.groupId, exercise.group, groups),
    })));

    this.selectionMode.set(false);
    this.clearSelection();
    this.isEditing.set(true);
    this.isCollapsed.set(false);
  }

  private resolveTemplateGroup(
    groupId: number | undefined,
    group: TrainingTemplate['groups'][number] | undefined,
    groups: Map<number, ExerciseGroupDto & { isTemplateGroup?: boolean }>,
  ): (ExerciseGroupDto & { isTemplateGroup?: boolean }) | null {
    if (groupId && groups.has(groupId)) {
      return groups.get(groupId)!;
    }

    if (!group) {
      return null;
    }

    const mappedGroup = {
      id: group.id,
      trainingSessionId: this.session.id ?? 0,
      type: group.type,
      name: group.name,
      sortOrder: group.sortOrder,
      rounds: group.rounds,
      restBetweenExercisesSec: group.restBetweenExercisesSec,
      restBetweenRoundsSec: group.restBetweenRoundsSec,
      isTemplateGroup: true,
    };
    groups.set(group.id, mappedGroup);
    return mappedGroup;
  }

  private removeGroupLocally(groupId: number): void {
    this.exercises.set(this.exercises().map(exercise =>
      exercise.group?.id === groupId
        ? { ...exercise, group: null }
        : exercise,
    ));
  }

  private getErrorMessage(err: any, fallback: string): string {
    return err?.error?.message || err?.error?.errors?.[0] || fallback;
  }


  getTrainingSessionDto(): TrainingSession | null {
    // Construir ejercicios de la sesión
    const exerciseSessions: ExerciseSession[] = this.exercises()
      .filter(ex => ex.exerciseId !== null) // Solo ejercicios con ejercicio seleccionado
      .map(ex => ({
        ...(ex.id !== undefined && { id: ex.id }),
        exerciseId: ex.exerciseId!,
        sortOrder: ex.sortOrder,
        observation: undefined,
        keyPoints: undefined,
        sets: ex.sets,
        reps: ex.reps,
        restSec: ex.restSec
      }));

    // Construir sesión de entrenamiento
    const trainingSession: TrainingSession = {
      ...(this.session.id !== undefined && { id: this.session.id }),
      heating: this.editedSession().heating || undefined,
      title: this.editedSession().title,
      numberSession: this.session.numberSession,
      daySession: undefined,
      notes: this.editedSession().notes || undefined,
      exerciseSessions: exerciseSessions
    };

    return trainingSession;
  }
}


