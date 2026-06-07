import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QC } from './qc';

describe('QC', () => {
  let component: QC;
  let fixture: ComponentFixture<QC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QC],
    }).compileComponents();

    fixture = TestBed.createComponent(QC);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
