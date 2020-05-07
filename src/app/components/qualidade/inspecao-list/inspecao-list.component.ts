import { EquipamentoDTO } from './../../../model/DTO/Equipamento.DTO';
import { NotaFiscalService } from './../../../services/domain/nota-fiscal.service';
import { InspecaoDTO } from './../../../model/DTO/Inspecao.DTO';
import { Component, OnInit } from '@angular/core';
import { InspecaoService } from '../../../services/domain/inspecao.service';
import { NotaFiscalDTO } from '../../../model/DTO/NotaFiscal.DTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspecao-list',
  templateUrl: './inspecao-list.component.html',
  styleUrls: ['./inspecao-list.component.css']
})
export class InspecaoListComponent implements OnInit {

  constructor(
              public insptecaoService: InspecaoService,
              public notaFiscalService: NotaFiscalService,
              private router: Router) { }

  inspecoes = new Array<InspecaoDTO>();
  inspecao = new InspecaoDTO();
  numeroNotaFiscal: string = "1254";
  notaFiscal = new NotaFiscalDTO();
  equipamento = new EquipamentoDTO();
  idEquipamento: string;
  loading:boolean = false;

  ngOnInit() {
    this.ListInspecao();
  }

  ListInspecao(){
    this.loading = false;
    this.insptecaoService.findAll().subscribe((responseApi: InspecaoDTO[]) => {
      this.inspecoes = responseApi;
      this.loading = true;
    }, error => { });
  }

  getColor(status: string){
    
    if(status == "PENDENTE"){
      return "color-pendente";
    }

    if(status == "ANDAMENTO"){
      return "color-analise";
    }

    if(status == "FINALIZADO"){
      return "color-finalizado";
    }
    if(status == "INTERROMPIDO"){
      return "color-interrompido";
    }
  }

  pesquisarPorNota(){
    this.loading = false; 
    this.notaFiscalService.findByNumero(this.numeroNotaFiscal).subscribe((responseApi: NotaFiscalDTO) => {
      this.notaFiscal = responseApi;    
      this.loading = true;  
    }, error => { });
  
  }

  onItemChange(equipamento: EquipamentoDTO){
    this.inspecao.equipamento = equipamento;
    
  }

  incluirInspecao(){ 
    this.loading = false; 
    this.inspecao.notaFiscal.id = this.notaFiscal.id;
    console.log('inspecao', this.inspecao);
    this.insptecaoService.inserir(this.inspecao).subscribe((responseApi) => {
      this.ListInspecao();
    }, error => { });

  }

  fazerInspecao(inspecaoId: string){   
   console.log('antes ', inspecaoId);
   this.router.navigate(['/inspecao_recebimento', inspecaoId]);
   //this.router.navigate(['/inspecao_recebimento', JSON.stringify(ids)]);
  
 }
   
}
