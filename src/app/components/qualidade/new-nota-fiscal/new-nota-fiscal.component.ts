import { ResponseApi } from '../../../model/response-api';
import { ActivatedRoute } from '@angular/router';
import { NotaFiscalDTO } from '../../../model/DTO/NotaFiscal.DTO';
import { NotaFiscalService } from '../../../services/domain/nota-fiscal.service';
import { EquipamentoService } from '../../../services/domain/equipamento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipamentoDTO } from "../../../model/DTO/Equipamento.DTO";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-nota-fiscal',
  templateUrl: './new-nota-fiscal.component.html',
  styleUrls: ['./new-nota-fiscal.component.css']
})
export class NewNotaFiscalComponent implements OnInit {

  @ViewChild("form")
  form: NgForm

  equipamento = new EquipamentoDTO("", "", "", "", "", null);
  equipamentos = [];
  nome: string;
  modal = "modal";
  IsmodelShow: boolean = false;
  display = 'none';
  notaFiscal = new NotaFiscalDTO('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', [],'', '', '', '', '');

  constructor(
    private equipamentoService: EquipamentoService, 
    private notaFiscalService: NotaFiscalService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    let id: string = this.route.snapshot.params['id'];
    if(id != undefined){
      this.findById(id);
    }
  }

  findById(id: string) {
    this.notaFiscalService.findById(id).subscribe((responseApi: NotaFiscalDTO) => {
      this.notaFiscal = responseApi;
      this.equipamentos = this.notaFiscal.equipamentos;          
    }, err => { });
  }

  fecharModalEquipamento() {
    this.display = 'none';
    console.log("fecha modal");
  }

  abrirModalEquipamento() {
    this.display = 'block';
    console.log("abre  modal");
  }

  incluirEquipamento() {

    if (this.equipamento.descricao != "") {
      this.equipamentos.push(this.equipamento);
      console.log(this.equipamentos[0].id);
      this.equipamento = new EquipamentoDTO("", "", "", "", "", null);
      this.fecharModalEquipamento();
    }
  }

  buscarEquipamento() {
    console.log(this.equipamento);
    this.equipamentoService.findByNpNs(this.equipamento.partNumber, this.equipamento.serialNumber).subscribe((responseApi: EquipamentoDTO) => {
      this.equipamento = responseApi;
    }, error => { });
  }

  removeEquipamento(id: number) {
    this.equipamentos.splice(id, 1);
  }

  salvarNota() {
    this.notaFiscal.equipamentos = this.equipamentos;
    console.log("Equipamentos: " + this.equipamentos + "Nota: " + this.notaFiscal);
    if(this.notaFiscal.id != ""){
      this.notaFiscalService.update(this.notaFiscal).subscribe((responseApi) => {
        console.log(responseApi);
      }, error => { });
    }
    this.notaFiscalService.inserir(this.notaFiscal).subscribe((responseApi) => {
      console.log(responseApi);
    }, error => { });

  }

}
