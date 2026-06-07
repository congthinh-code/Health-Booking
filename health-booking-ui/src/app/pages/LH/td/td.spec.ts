import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TD } from './td';

describe('TD', () => {
  let component: TD;
  let fixture: ComponentFixture<TD>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TD],
    }).compileComponents();

    fixture = TestBed.createComponent(TD);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
