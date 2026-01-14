import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseFiltersComponent } from './exercise-filters';

describe('ExerciseFiltersComponent', () => {
  let component: ExerciseFiltersComponent;
  let fixture: ComponentFixture<ExerciseFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});