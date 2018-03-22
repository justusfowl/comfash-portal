import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FittingStreamComponent } from './fitting-stream.component';

describe('FittingStreamComponent', () => {
  let component: FittingStreamComponent;
  let fixture: ComponentFixture<FittingStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FittingStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FittingStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
