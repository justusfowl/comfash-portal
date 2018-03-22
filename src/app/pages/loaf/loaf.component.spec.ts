import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoafComponent } from './loaf.component';

describe('LoafComponent', () => {
  let component: LoafComponent;
  let fixture: ComponentFixture<LoafComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoafComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
