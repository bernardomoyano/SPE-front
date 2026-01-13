import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExerciseComponent } from './form-exercise';

describe('FormExerciseComponent', () => {
  let component: FormExerciseComponent;
  let fixture: ComponentFixture<FormExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormExerciseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});