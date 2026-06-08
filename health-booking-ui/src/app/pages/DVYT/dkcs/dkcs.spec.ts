import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dkcs } from './dkcs';

describe('Dkcs', () => {
  let component: Dkcs;
  let fixture: ComponentFixture<Dkcs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dkcs],
    }).compileComponents();

    fixture = TestBed.createComponent(Dkcs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
