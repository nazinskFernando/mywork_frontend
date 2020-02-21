import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipamentoDTO } from "../../../model/DTO/EquipamentoDTO";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-nota-fiscal',
  templateUrl: './new-nota-fiscal.component.html',
  styleUrls: ['./new-nota-fiscal.component.css']
})
export class NewNotaFiscalComponent implements OnInit {

  @ViewChild("form")
  form: NgForm

  equipamento = new EquipamentoDTO("", "", "", "", "");
  equipamentos = [];
  nome: string;
  modal = "modal";
  IsmodelShow: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.IsmodelShow = true;// set false while you need open your model popup
    // do your more code
  }
  incluirEquipamento() {

    if (this.equipamento.descricao != "") {
      this.equipamentos.push(this.equipamento);
      console.log(this.equipamentos[0].ns);
      this.equipamento = new EquipamentoDTO("", "", "", "", "");
    }
  }

  removeEquipamento(id: number){
    this.equipamentos.splice(id, 1);
  }
}
