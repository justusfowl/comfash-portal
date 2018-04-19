import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchallComponent } from './catchall.component';

describe('CatchallComponent', () => {
  let component: CatchallComponent;
  let fixture: ComponentFixture<CatchallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
