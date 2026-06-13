import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GioiThieu } from './gioi-thieu';

describe('GioiThieu', () => {
  let component: GioiThieu;
  let fixture: ComponentFixture<GioiThieu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GioiThieu],
    }).compileComponents();

    fixture = TestBed.createComponent(GioiThieu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
