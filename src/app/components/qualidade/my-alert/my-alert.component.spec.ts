import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAlertComponent } from './my-alert.component';

describe('MyAlertComponent', () => {
  let component: MyAlertComponent;
  let fixture: ComponentFixture<MyAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
