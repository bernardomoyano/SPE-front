import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRegister } from './card-register';

describe('CardRegister', () => {
  let component: CardRegister;
  let fixture: ComponentFixture<CardRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
