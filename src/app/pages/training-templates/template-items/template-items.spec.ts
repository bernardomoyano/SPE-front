import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateItems } from './template-items';

describe('TemplateItems', () => {
  let component: TemplateItems;
  let fixture: ComponentFixture<TemplateItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
