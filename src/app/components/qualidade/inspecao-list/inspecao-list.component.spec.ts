import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspecaoListComponent } from './inspecao-list.component';

describe('InspecaoListComponent', () => {
  let component: InspecaoListComponent;
  let fixture: ComponentFixture<InspecaoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspecaoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspecaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
