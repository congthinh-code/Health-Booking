import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dkbs } from './dkbs';

describe('Dkbs', () => {
  let component: Dkbs;
  let fixture: ComponentFixture<Dkbs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dkbs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dkbs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
