import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspecaoRecebimentoComponent } from './inspecao-recebimento.component';

describe('InspecaoRecebimentoComponent', () => {
  let component: InspecaoRecebimentoComponent;
  let fixture: ComponentFixture<InspecaoRecebimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspecaoRecebimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspecaoRecebimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
