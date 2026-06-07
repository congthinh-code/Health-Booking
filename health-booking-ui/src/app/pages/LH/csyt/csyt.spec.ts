import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSYT } from './csyt';

describe('CSYT', () => {
  let component: CSYT;
  let fixture: ComponentFixture<CSYT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CSYT],
    }).compileComponents();

    fixture = TestBed.createComponent(CSYT);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
