import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCoach } from './register-coach';

describe('RegisterCoach', () => {
  let component: RegisterCoach;
  let fixture: ComponentFixture<RegisterCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCoach]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCoach);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
