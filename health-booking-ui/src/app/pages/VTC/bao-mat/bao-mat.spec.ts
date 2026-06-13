import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoMat } from './bao-mat';

describe('BaoMat', () => {
  let component: BaoMat;
  let fixture: ComponentFixture<BaoMat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaoMat],
    }).compileComponents();

    fixture = TestBed.createComponent(BaoMat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
