import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNotaFiscalComponent } from './list-nota-fiscal.component';

describe('ListNotaFiscalComponent', () => {
  let component: ListNotaFiscalComponent;
  let fixture: ComponentFixture<ListNotaFiscalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNotaFiscalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNotaFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
