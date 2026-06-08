import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dkng } from './dkng';

describe('Dkng', () => {
  let component: Dkng;
  let fixture: ComponentFixture<Dkng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dkng],
    }).compileComponents();

    fixture = TestBed.createComponent(Dkng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
