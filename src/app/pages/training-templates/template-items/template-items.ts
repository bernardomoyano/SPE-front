import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FormExerciseGroupComponent,
  ExerciseGroupFormData,
  ExerciseGroupType,
} from '../../../components/form-exercise-group/form-exercise-group';
import { ExerciseSelectDto } from '../../../models/exercise-select-dto.model';
import {
  ExerciseGroupTrainingTemplate,
  TrainingTemplate,
  UpsertExerciseGroupTrainingTemplate,
  UpsertTrainingTemplate,
} from '../../../models/training-template/training-template.model';

interface TemplateFormData {
  name: string;
  heating: string;
  title: string;
  notes: string;
}

interface TemplateExerciseRow {
  id?: number;
  exerciseId: number | null;
  sets: number;
  reps: string;
  restSec: number;
  isEditing: boolean;
  sortOrder: number;
  observation?: string;
  keyPoints?: string;
  isSelected?: boolean;
  group?: TemplateExerciseGroupRow | null;
}

interface TemplateExerciseGroupRow {
  id: number;
  type: ExerciseGroupType;
  name?: string;
  sortOrder?: number;
  rounds?: number;
  restBetweenExercisesSec?: number;
  restBetweenRoundsSec: number;
}

interface ExerciseDisplayRow {
  type: 'exercise';
  exercise: TemplateExerciseRow;
  exerciseIndex: number;
  isInGroup: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

interface GroupCardRow {
  type: 'group-card';
  group: TemplateExerciseGroupRow;
  exercises: Array<{ exercise: TemplateExerciseRow; exerciseIndex: number }>;
}

type DisplayRow = ExerciseDisplayRow | GroupCardRow;

@Component({
  selector: 'app-template-items',
  imports: [CommonModule, FormsModule, FormExerciseGroupComponent],
  templateUrl: './template-items.html',
  styleUrl: './template-items.scss',
})
export class TemplateItems implements OnInit, OnChanges {
  @Input() template: TrainingTemplate | null = null;
  @Input() TemplateNumber: number = 1;
  @Input() isNew = false;
  @Input() availableExercises: ExerciseSelectDto[] = [];
  @Input() loadingExercises = false;
  @Output() save = new EventEmitter<UpsertTrainingTemplate>();
  @Output() delete = new EventEmitter<void>();
  @Output() cancelNew = new EventEmitter<void>();

  isCollapsed = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectionMode = signal<boolean>(false);
  showGroupForm = signal<boolean>(false);
  groupType = signal<ExerciseGroupType | null>(null);
  nextGroupClientId = 1;

  editedTemplate = signal<TemplateFormData>({
    name: '',
    heating: '',
    title: '',
    notes: '',
  });

  exercises = signal<TemplateExerciseRow[]>([]);

  selectedExercises = computed(() => this.exercises().filter(ex => ex.isSelected));

  currentGroupType = computed<ExerciseGroupType | null>(() => {
    const count = this.selectedExercises().length;
    if (count === 2) return 'superserie';
    if (count === 3) return 'triserie';
    if (count > 3) return 'circuito';
    return null;
  });

  groupButtonLabel = computed<string>(() => {
    const labels: Record<ExerciseGroupType, string> = {
      superserie: 'Crear Superserie',
      triserie: 'Crear Triserie',
      circuito: 'Crear Circuito',
    };
    const type = this.currentGroupType();
    return type ? labels[type] : '';
  });

  displayRows = computed<DisplayRow[]>(() => {
    const exercises = this.exercises();
    const processedGroups = new Set<number>();
    const rows: DisplayRow[] = [];

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      const groupId = exercise.group?.id;

      if (!groupId) {
        rows.push({
          type: 'exercise',
          exercise,
          exerciseIndex: i,
          isInGroup: false,
          isFirstInGroup: false,
          isLastInGroup: false,
        });
        continue;
      }

      if (processedGroups.has(groupId)) {
        continue;
      }

      processedGroups.add(groupId);
      rows.push({
        type: 'group-card',
        group: exercise.group!,
        exercises: exercises
          .map((item, index) => ({ exercise: item, exerciseIndex: index }))
          .filter(item => item.exercise.group?.id === groupId),
      });
    }

    return rows;
  });

  ngOnInit(): void {
    this.hydrateFromInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template'] && !changes['template'].firstChange) {
      this.hydrateFromInput();
    }
  }

  toggleCollapse(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  enableEdit(): void {
    this.hydrateFromInput(true);
    this.isEditing.set(true);
  }

  saveChanges(): void {
    const request = this.buildRequest();
    if (!request) return;
    this.save.emit(request);
    if (!this.isNew) {
      this.isEditing.set(false);
    }
  }

  cancelChanges(): void {
    if (this.isNew) {
      this.cancelNew.emit();
      return;
    }

    this.hydrateFromInput();
    this.isEditing.set(false);
  }

  onDelete(): void {
    this.delete.emit();
  }

  updateField(field: keyof TemplateFormData, value: string): void {
    this.editedTemplate.set({
      ...this.editedTemplate(),
      [field]: value,
    });
  }

  addExercise(): void {
    const newExercise: TemplateExerciseRow = {
      exerciseId: null,
      sets: 3,
      reps: '10',
      restSec: 60,
      isEditing: true,
      sortOrder: this.exercises().length + 1,
    };
    this.exercises.set([...this.exercises(), newExercise]);
  }

  updateExercise(index: number, field: keyof TemplateExerciseRow, value: any): void {
    const exercises = [...this.exercises()];
    exercises[index] = {
      ...exercises[index],
      [field]: value,
    };
    this.exercises.set(exercises);
  }

  saveExercise(index: number): void {
    this.updateExercise(index, 'isEditing', false);
  }

  editExercise(index: number): void {
    this.updateExercise(index, 'isEditing', true);
  }

  deleteExercise(index: number): void {
    const exercises = [...this.exercises()];
    exercises.splice(index, 1);
    exercises.forEach((exercise, idx) => exercise.sortOrder = idx + 1);
    this.exercises.set(exercises);
  }

  getExerciseName(exerciseId: number | null): string {
    if (!exerciseId) return 'Sin seleccionar';
    return this.availableExercises.find(exercise => exercise.id === exerciseId)?.name || 'Desconocido';
  }

  toggleExerciseSelection(index: number): void {
    const exercises = [...this.exercises()];
    exercises[index] = {
      ...exercises[index],
      isSelected: !exercises[index].isSelected,
    };
    this.exercises.set(exercises);

    if (!exercises.some(exercise => exercise.isSelected)) {
      this.selectionMode.set(false);
    }
  }

  clearSelection(): void {
    this.exercises.set(this.exercises().map(exercise => ({ ...exercise, isSelected: false })));
    this.selectionMode.set(false);
  }

  onExerciseRowClick(index: number): void {
    if (!this.selectionMode()) {
      this.selectionMode.set(true);
    }
    this.toggleExerciseSelection(index);
  }

  getGroupTypeLabel(type: string): string {
    const map: Record<string, string> = {
      superserie: 'Superserie',
      superset: 'Superserie',
      triserie: 'Triserie',
      triset: 'Triserie',
      circuito: 'Circuito',
      circuit: 'Circuito',
      giantset: 'Serie gigante',
    };
    return map[type?.toLowerCase()] ?? type;
  }

  trackByDisplayRow(_: number, row: DisplayRow): string {
    if (row.type === 'exercise') return `ex-${row.exerciseIndex}`;
    return `group-${row.group.id}`;
  }

  ungroupExercises(groupId: number): void {
    this.exercises.set(this.exercises().map(exercise =>
      exercise.group?.id === groupId
        ? { ...exercise, group: null, isSelected: false }
        : exercise,
    ));
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
    const selected = this.selectedExercises();
    if (!type || selected.length < 2) return;

    const group: TemplateExerciseGroupRow = {
      id: this.nextGroupClientId++,
      type,
      name: this.getGroupTypeLabel(type),
      sortOrder: selected[0].sortOrder,
      rounds: formData.rounds,
      restBetweenExercisesSec: 0,
      restBetweenRoundsSec: formData.restBetweenRoundsSec,
    };

    this.exercises.set(this.exercises().map(exercise =>
      exercise.isSelected
        ? { ...exercise, group, isSelected: false }
        : exercise,
    ));
    this.selectionMode.set(false);
    this.showGroupForm.set(false);
    this.groupType.set(null);
  }

  private hydrateFromInput(forceEdit = false): void {
    if (this.template) {
      this.editedTemplate.set({
        name: this.template.name,
        heating: this.template.heating || '',
        title: this.template.title,
        notes: this.template.notes || '',
      });

      const groups = new Map<number, TemplateExerciseGroupRow>();
      this.template.groups.forEach(group => {
        groups.set(group.id, this.toGroupRow(group));
      });

      this.exercises.set(this.template.exercises.map(exercise => ({
        id: exercise.id,
        exerciseId: exercise.exerciseId,
        sets: exercise.sets,
        reps: exercise.reps,
        restSec: exercise.restSec,
        isEditing: false,
        sortOrder: exercise.sortOrder,
        observation: exercise.observation,
        keyPoints: exercise.keyPoints,
        group: this.resolveExerciseGroup(exercise, groups),
      })));

      this.nextGroupClientId = Math.max(0, ...Array.from(groups.keys())) + 1;
      this.isEditing.set(forceEdit);
      this.isCollapsed.set(false);
    } else {
      this.editedTemplate.set({ name: '', heating: '', title: '', notes: '' });
      this.exercises.set([]);
      this.nextGroupClientId = 1;
      this.isEditing.set(true);
      this.isCollapsed.set(false);
    }

    this.selectionMode.set(false);
    this.showGroupForm.set(false);
    this.groupType.set(null);
  }

  private buildRequest(): UpsertTrainingTemplate | null {
    const template = this.editedTemplate();
    const exercises = this.exercises().filter(exercise => exercise.exerciseId !== null);

    if (!template.name.trim() || !template.title.trim() || exercises.length === 0) {
      return null;
    }

    const uniqueGroups = new Map<number, TemplateExerciseGroupRow>();
    exercises.forEach(exercise => {
      if (exercise.group) {
        uniqueGroups.set(exercise.group.id, exercise.group);
      }
    });

    return {
      name: template.name.trim(),
      title: template.title.trim(),
      heating: template.heating.trim() || undefined,
      notes: template.notes.trim() || undefined,
      groups: Array.from(uniqueGroups.values()).map(group => ({
        clientId: group.id,
        type: group.type,
        name: group.name,
        sortOrder: group.sortOrder,
        rounds: group.rounds,
        restBetweenExercisesSec: group.restBetweenExercisesSec,
        restBetweenRoundsSec: group.restBetweenRoundsSec,
      } satisfies UpsertExerciseGroupTrainingTemplate)),
      exercises: exercises.map((exercise, index) => ({
        clientGroupId: exercise.group?.id,
        exerciseId: exercise.exerciseId!,
        sortOrder: index + 1,
        observation: exercise.observation,
        keyPoints: exercise.keyPoints,
        sets: exercise.sets,
        reps: exercise.reps,
        restSec: exercise.restSec,
      })),
    };
  }

  private resolveExerciseGroup(exercise: { groupId?: number; group?: ExerciseGroupTrainingTemplate }, groups: Map<number, TemplateExerciseGroupRow>): TemplateExerciseGroupRow | null {
    if (exercise.groupId && groups.has(exercise.groupId)) {
      return groups.get(exercise.groupId)!;
    }

    if (exercise.group) {
      const group = this.toGroupRow(exercise.group);
      groups.set(group.id, group);
      return group;
    }

    return null;
  }

  private toGroupRow(group: ExerciseGroupTrainingTemplate): TemplateExerciseGroupRow {
    return {
      id: group.id,
      type: this.normalizeGroupType(group.type),
      name: group.name,
      sortOrder: group.sortOrder,
      rounds: group.rounds,
      restBetweenExercisesSec: group.restBetweenExercisesSec,
      restBetweenRoundsSec: group.restBetweenRoundsSec,
    };
  }

  private normalizeGroupType(type: string): ExerciseGroupType {
    const normalized = type.toLowerCase();
    if (normalized === 'superset' || normalized === 'superserie') return 'superserie';
    if (normalized === 'triset' || normalized === 'triserie') return 'triserie';
    return 'circuito';
  }
}

