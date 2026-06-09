import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPlanificationsComponent } from './card-planifications';

describe('CardPlanificationsComponent', () => {
  let component: CardPlanificationsComponent;
  let fixture: ComponentFixture<CardPlanificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPlanificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPlanificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
