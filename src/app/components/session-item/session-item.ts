import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from '../../services/exercise.service';
import { TrainingSessionService } from '../../services/microcycle.service';
import { ExerciseSelectDto } from '../../models/exercise-select-dto.model';
import { TrainingSession } from '../../models/training-session/training-session.model';
import { ExerciseSession } from '../../models/training-session/exercise-session.model';

export interface TrainingSessionData {
  id?: number;
  heating: string;
  title: string;
  notes: string;
  numberSession: number;
}

export interface ExerciseRow {
  exerciseId: number | null;
  sets: number;
  reps: string;
  restSec: number;
  isEditing: boolean;
  sortOrder: number;
}

@Component({
  selector: 'app-session-item',
  imports: [CommonModule, FormsModule],
  templateUrl: './session-item.html',
  styleUrl: './session-item.scss',
})
export class SessionItemComponent implements OnInit {
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
    numberSession: 1
  });

  // Lista de ejercicios disponibles desde el backend
  availableExercises = signal<ExerciseSelectDto[]>([]);
  loadingExercises = signal<boolean>(true);

  // Lista de ejercicios de esta sesión
  exercises = signal<ExerciseRow[]>([]);

  constructor(
    private exerciseService: ExerciseService,
    private trainingSessionService: TrainingSessionService
  ) {}

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
            // Precargar datos de la sesión
            const sessionData: TrainingSessionData = {
              id: trainingSession.id,
              heating: trainingSession.heating || '',
              title: trainingSession.title,
              notes: trainingSession.notes || '',
              numberSession: trainingSession.numberSession
            };

            this.session = sessionData;
            this.editedSession.set({ ...sessionData });

            // Precargar ejercicios de la sesión
            if (trainingSession.exerciseSessions && trainingSession.exerciseSessions.length > 0) {
              const exerciseRows: ExerciseRow[] = trainingSession.exerciseSessions.map(es => ({
                exerciseId: es.exerciseId,
                sets: es.sets,
                reps: es.reps,
                restSec: es.restSec,
                isEditing: false,
                sortOrder: es.sortOrder
              }));

              this.exercises.set(exerciseRows);
            }

            // Si hay datos cargados, no mostrar en modo edición
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

  // Método público para obtener los datos de la sesión en formato DTO
  getTrainingSessionDto(): TrainingSession | null {
    // Construir ejercicios de la sesión
    const exerciseSessions: ExerciseSession[] = this.exercises()
      .filter(ex => ex.exerciseId !== null) // Solo ejercicios con ejercicio seleccionado
      .map(ex => ({
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
