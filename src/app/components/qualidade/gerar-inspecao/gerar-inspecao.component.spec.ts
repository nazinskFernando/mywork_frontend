import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerarInspecaoComponent } from './gerar-inspecao.component';

describe('GerarInspecaoComponent', () => {
  let component: GerarInspecaoComponent;
  let fixture: ComponentFixture<GerarInspecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerarInspecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerarInspecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
