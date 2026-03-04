import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Planifications } from './planifications';

describe('Planifications', () => {
  let component: Planifications;
  let fixture: ComponentFixture<Planifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planifications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Planifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});