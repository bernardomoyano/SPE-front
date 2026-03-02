import { Component, OnInit, signal, computed, ViewChildren, QueryList, effect } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { PlanningWithMicrocyclesDto } from '../../models/planning-with-microcycles.model';
import { WeekTabsComponent } from '../../components/week-tabs/week-tabs';
import { SessionItemComponent, TrainingSessionData } from '../../components/session-item/session-item';
import { TrainingSessionService } from '../../services/training-session.service';
import { TrainingSessionService as MicrocycleService } from '../../services/microcycle.service';
import { AlertService } from '../../services/alert.service';
import { CreateTrainingSessions } from '../../models/training-session/create-training-sessions.model';

@Component({
  selector: 'app-details-planifications',
  imports: [CommonModule, WeekTabsComponent, SessionItemComponent],
  templateUrl: './details-planifications.html',
  styleUrl: './details-planifications.scss',
})
export class DetailsPlanifications implements OnInit {
  @ViewChildren(SessionItemComponent) sessionItems!: QueryList<SessionItemComponent>;

  planning = signal<PlanningWithMicrocyclesDto | null>(null);
  activeWeek = signal<number>(1);
  
  // Sessions grouped by week number
  sessionsByWeek = signal<Map<number, TrainingSessionData[]>>(new Map());
  
  // Computed: Get sessions for active week
  activeSessions = computed(() => {
    const week = this.activeWeek();
    return this.sessionsByWeek().get(week) || [];
  });

  // Computed: Get microcycle ID for active week
  activeMicrocycleId = computed(() => {
    const week = this.activeWeek();
    const planning = this.planning();
    
    if (!planning) return 0;
    
    const microcycle = planning.microcycles.find(m => m.weekNumber === week);
    
    return microcycle?.id || 0;
  });
  
  constructor(
    private router: Router,
    private location: Location,
    private trainingSessionService: TrainingSessionService,
    private microcycleService: MicrocycleService,
    private alertService: AlertService
  ) {
    // Get planning data from navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || this.location.getState() as any;
    
    if (state && state['planning']) {
      this.planning.set(state['planning']);
    }

    // Effect para cargar sesiones cuando cambia la semana activa
    effect(() => {
      const microcycleId = this.activeMicrocycleId();
      const week = this.activeWeek();
      
      if (microcycleId > 0) {
        this.loadMicrocycleSessions(microcycleId, week);
      }
    });
  }

  ngOnInit(): void {
    // If no planning data, redirect back
    if (!this.planning()) {
      this.goBack();
    }
  }

  onWeekChange(week: number): void {
    this.activeWeek.set(week);
  }

  private loadMicrocycleSessions(microcycleId: number, week: number): void {
    this.microcycleService.getMicrocycleById(microcycleId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const microcycle = response.data;
          
          // Convertir TrainingSession[] a TrainingSessionData[]
          if (microcycle.trainingSessions && microcycle.trainingSessions.length > 0) {
            const sessions: TrainingSessionData[] = microcycle.trainingSessions.map(ts => ({
              id: ts.id,
              heating: ts.heating || '',
              title: ts.title,
              notes: ts.notes || '',
              numberSession: ts.numberSession
            }));

            // Actualizar el mapa de sesiones
            const updatedMap = new Map(this.sessionsByWeek());
            updatedMap.set(week, sessions);
            this.sessionsByWeek.set(updatedMap);
          } else {
            // Limpiar sesiones de esta semana si no hay
            const updatedMap = new Map(this.sessionsByWeek());
            updatedMap.delete(week);
            this.sessionsByWeek.set(updatedMap);
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar sesiones del microciclo:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'active': 'Activo',
      'paused': 'Pausado',
      'finished': 'Finalizado'
    };
    return labels[status] || status;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'training': 'Entrenamiento',
      'nutrition': 'Nutrición',
      'complete': 'Completo'
    };
    return labels[type] || type;
  }

  addSession(): void {
    const week = this.activeWeek();
    const sessions = this.sessionsByWeek().get(week) || [];
    const newSession: TrainingSessionData = {
      heating: '',
      title: '',
      notes: '',
      numberSession: sessions.length + 1
    };
    
    const updatedMap = new Map(this.sessionsByWeek());
    updatedMap.set(week, [...sessions, newSession]);
    this.sessionsByWeek.set(updatedMap);
  }

  saveSession(index: number, session: TrainingSessionData): void {
    const week = this.activeWeek();
    const sessions = [...(this.sessionsByWeek().get(week) || [])];
    sessions[index] = session;
    
    const updatedMap = new Map(this.sessionsByWeek());
    updatedMap.set(week, sessions);
    this.sessionsByWeek.set(updatedMap);
  }

  deleteSession(index: number): void {
    const week = this.activeWeek();
    const sessions = [...(this.sessionsByWeek().get(week) || [])];
    sessions.splice(index, 1);
    
    // Renumerar las sesiones
    sessions.forEach((session, idx) => {
      session.numberSession = idx + 1;
    });
    
    const updatedMap = new Map(this.sessionsByWeek());
    if (sessions.length > 0) {
      updatedMap.set(week, sessions);
    } else {
      updatedMap.delete(week);
    }
    this.sessionsByWeek.set(updatedMap);
  }

  saveAllSessions(): void {
    const microcycleId = this.activeMicrocycleId();
    
    if (!microcycleId) {
      this.alertService.showError('No se ha encontrado el microciclo');
      return;
    }

    // Recolectar todas las sesiones de los componentes hijos
    const trainingSessions = this.sessionItems
      .map(item => item.getTrainingSessionDto())
      .filter(dto => dto !== null);

    if (trainingSessions.length === 0) {
      this.alertService.showError('No hay sesiones válidas para guardar');
      return;
    }

    const payload: CreateTrainingSessions = {
      microcycleId,
      trainingSessions: trainingSessions as any[]
    };

    this.trainingSessionService.createBulkTrainingSessions(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertService.showSuccess(response.message || 'Sesiones guardadas exitosamente');
        } else {
          this.alertService.showError(response.message || 'Error al guardar las sesiones');
        }
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Error al guardar las sesiones';
        this.alertService.showError(errorMessage);
      }
    });
  }
}
