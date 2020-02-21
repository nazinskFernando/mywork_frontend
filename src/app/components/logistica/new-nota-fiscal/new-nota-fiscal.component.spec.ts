import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNotaFiscalComponent } from './new-nota-fiscal.component';

describe('NewNotaFiscalComponent', () => {
  let component: NewNotaFiscalComponent;
  let fixture: ComponentFixture<NewNotaFiscalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNotaFiscalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNotaFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
