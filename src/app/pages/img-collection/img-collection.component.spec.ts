import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCollectionComponent } from './img-collection.component';

describe('ImgCollectionComponent', () => {
  let component: ImgCollectionComponent;
  let fixture: ComponentFixture<ImgCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
