import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPlanningComponent } from './form-planning';

describe('FormPlanningComponent', () => {
  let component: FormPlanningComponent;
  let fixture: ComponentFixture<FormPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
