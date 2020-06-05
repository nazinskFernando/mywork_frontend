
import { EquipamentoDTO } from './../../../model/DTO/Equipamento.DTO';
import { ClienteDTO } from './../../../model/DTO/Cliente.DTO';
import { ClienteService } from './../../../services/domain/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { NotaFiscalDTO } from '../../../model/DTO/NotaFiscal.DTO';
import { NotaFiscalService } from '../../../services/domain/nota-fiscal.service';
import { EquipamentoService } from '../../../services/domain/equipamento.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-nota-fiscal',
  templateUrl: './new-nota-fiscal.component.html',
  styleUrls: ['./new-nota-fiscal.component.css']
})
export class NewNotaFiscalComponent implements OnInit {
  @ViewChild("closeBtn") closeBtn: ElementRef;
  @ViewChild("form")
  form: NgForm

  notaFiscalId: string;

  equipamento = new EquipamentoDTO();
  equipamentos = new Array<EquipamentoDTO>();
  equipamentosRemovido = new Array<EquipamentoDTO>();
  equipamentosNovos = new Array<EquipamentoDTO>();
  dataEntrada: Date;

  nome: string;
  modal = "modal";
  IsmodelShow: boolean = false;
  display = 'none';
  notaFiscal = new NotaFiscalDTO();
  clientes = new Array<ClienteDTO>();


  constructor(
    private equipamentoService: EquipamentoService, 
    private notaFiscalService: NotaFiscalService,
    private clienteService: ClienteService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.notaFiscalId = this.route.snapshot.params['id'];
    if(this.notaFiscalId != undefined){
      this.findById(this.notaFiscalId);
    }
    this.findAllCliente();
  }

  findAllCliente(){
    this.clienteService.findAll().subscribe((responseApi: ClienteDTO[]) => {
      this.clientes = responseApi;       
    }, err => { });
  }

  findById(id: string) {
    this.notaFiscalService.findById(id).subscribe((responseApi: NotaFiscalDTO) => {
      this.notaFiscal = responseApi;           
      // this.dataEntrada = new Date(this.notaFiscal.dataEntrada);
      // console.log('data entrada ', this.dataEntrada);
    }, err => { });
  }

  incluirEquipamento() {

    if (this.equipamento.descricao != "") {
      for(var x=0; x < this.clientes.length; x++){
        if(this.equipamento.cliente.id == this.clientes[x].id){
          this.equipamento.cliente = this.clientes[x];
        }
      }   
      this.notaFiscal.equipamentos.push(this.equipamento);     

      this.equipamento = new EquipamentoDTO();
      this.closeModal();
    }
  }

  buscarEquipamento() {
    console.log(this.equipamento);
    this.equipamentoService.findByNpNs(this.equipamento.partNumber, this.equipamento.serialNumber).subscribe((responseApi: EquipamentoDTO) => {
      this.equipamento = responseApi;
    }, error => { });
  }

  removeEquipamento(index: number, id: string) {
  
    this.equipamentos.splice(index, 1);
  }

  salvarNota() {
        
    // this.notaFiscal.dataEntrada  = this.dataEntrada.toString();
    console.log('notaFiscal ', this.notaFiscal);
    if(this.notaFiscal.id != undefined){
      
      this.notaFiscalService.update(this.notaFiscal).subscribe((responseApi) => {
        
      }, error => { });
    } else {
      
      
      this.notaFiscalService.inserir(this.notaFiscal).subscribe((responseApi) => {
        console.log(responseApi);
      }, error => { });
    }   

  }
  closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

}
