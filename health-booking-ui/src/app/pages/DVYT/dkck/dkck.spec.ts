import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dkck } from './dkck';

describe('Dkck', () => {
  let component: Dkck;
  let fixture: ComponentFixture<Dkck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dkck],
    }).compileComponents();

    fixture = TestBed.createComponent(Dkck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
