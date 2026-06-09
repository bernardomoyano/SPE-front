import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { InputComponent } from '../input/input';
import { Button } from '../button/button';

export type ExerciseGroupType = 'superserie' | 'triserie' | 'circuito';

export interface ExerciseGroupFormData {
  rounds: number;
  restBetweenRoundsSec: number;
}

@Component({
  selector: 'app-form-exercise-group',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, Button],
  templateUrl: './form-exercise-group.html',
  styleUrl: './form-exercise-group.scss',
})
export class FormExerciseGroupComponent implements OnInit {
  @Input() groupType!: ExerciseGroupType;
  @Input() exerciseCount: number = 2;

  @Output() save = new EventEmitter<ExerciseGroupFormData>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rounds: [3, [Validators.required, Validators.min(1), Validators.max(99)]],
      restBetweenRoundsSec: [60, [Validators.required, Validators.min(0), Validators.max(3600)]],
    });
  }

  get groupLabel(): string {
    const labels: Record<ExerciseGroupType, string> = {
      superserie: 'Superserie',
      triserie: 'Triserie',
      circuito: 'Circuito',
    };
    return labels[this.groupType] ?? '';
  }

  get groupIcon(): string {
    const icons: Record<ExerciseGroupType, string> = {
      superserie: '2',
      triserie: '3',
      circuito: '∞',
    };
    return icons[this.groupType] ?? '•';
  }

  get roundsControl(): FormControl {
    return this.form.get('rounds') as FormControl;
  }

  get restControl(): FormControl {
    return this.form.get('restBetweenRoundsSec') as FormControl;
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value as ExerciseGroupFormData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOverlayClick(): void {
    this.cancel.emit();
  }
}
