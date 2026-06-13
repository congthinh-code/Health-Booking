import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyDinh } from './quy-dinh';

describe('QuyDinh', () => {
  let component: QuyDinh;
  let fixture: ComponentFixture<QuyDinh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuyDinh],
    }).compileComponents();

    fixture = TestBed.createComponent(QuyDinh);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
