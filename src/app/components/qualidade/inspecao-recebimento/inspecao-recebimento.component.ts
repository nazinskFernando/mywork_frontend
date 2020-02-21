import { LaudoDTO } from './../../../model/DTO/Laudo.DTO';
import { ResponseApi } from './../../../model/response-api';
import { InspecaoDTO } from './../../../model/DTO/Inspecao.DTO';
import { InspecaoService } from './../../../services/domain/inspecao.service';
import { Ids } from './../list-nota-fiscal/list-nota-fiscal.component';
import { EquipamentoNotaFiscalDTO } from './../../../model/DTO/EquipamentoNotaFiscal.DTO';
import { NotaFiscalService } from './../../../services/domain/nota-fiscal.service';
import { NotaFiscalDTO } from './../../../model/DTO/NotaFiscal.DTO';
import { EquipamentoDTO } from './../../../model/DTO/Equipamento.DTO';
import { Component, OnInit } from '@angular/core';
import { EquipamentoService } from '../../../services/domain/equipamento.service';
import { ActivatedRoute } from '@angular/router';

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-inspecao-recebimento',
  templateUrl: './inspecao-recebimento.component.html',
  styleUrls: ['./inspecao-recebimento.component.css']
})
export class InspecaoRecebimentoComponent implements OnInit {

  urls = [];
  qtdImagens: number = 0;
  index: number=0;
  equipamentoNotaFisca: EquipamentoNotaFiscalDTO;

  equipamento: EquipamentoDTO;
  notaFiscal: NotaFiscalDTO;
  inspecao: InspecaoDTO;
  laudos = new Array<LaudoDTO>();
  laudo = new LaudoDTO('','','',null,'');

  isRelatorio: Boolean= false;

  constructor(
          private route: ActivatedRoute, 
          private equipamentoService: EquipamentoService,
          private notaFiscalService: NotaFiscalService,
          private inspecaoService: InspecaoService) {
  }

 
  criarInspecao(){
    this.isRelatorio = true;
   /* console.log("clicado");
    this.equipamento = this.equipamentoNotaFisca.equipamento;
    this.notaFiscal= this.equipamentoNotaFisca.notaFiscal;
    this.laudo = new LaudoDTO('','xdfv','sfv','sfdvsdf');
    this.laudos.push(this.laudo);
    console.log(this.urls);
    this.inspecao = new InspecaoDTO(null, this.equipamento, this.notaFiscal, null, this.laudos);
    this.inspecaoService.inserir(this.inspecao).subscribe((responseApi) => {
      console.log(responseApi);
    }, error => {});*/
  }

  abrirRelatorio(){   
   window.open("http://developer.porumclique.com.br/img/pdf/inspecao1.pdf", '_blank');
  }
  ngOnInit(): void {
    const ids: Ids = JSON.parse(this.route.snapshot.params['ids']);
    console.log(ids.idEquipamento);
    this.findbyEquipamentoId(ids.idEquipamento, ids.idNotaFiscal);
    //this.findbyNotaFiscalId(ids.idNotaFiscal);
  }

  findbyEquipamentoId(idEquipamento: string, idNotaFiscal: string){
    this.inspecaoService.findAllById(idEquipamento, idNotaFiscal).subscribe((responseApi: EquipamentoNotaFiscalDTO) => {
       this.equipamentoNotaFisca = responseApi;      
     }, error => { });
   }

   /*findbyNotaFiscalId(id: string){
    this.notaFiscalService.findById(id).subscribe((responseApi: NotaFiscalDTO) => {
       this.equipamentoNotaFisca = responseApi;
     }, error => { });
   }*/

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        var image = new Image();
        reader.onload = (event: any) => {
          image.src = event.target.result;
          console.log(event);
          this.urls.push(event.target.result);
          this.qtdImagens = this.urls.length;
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    //https://stackblitz.com/edit/angular-multi-file-upload-preview?file=app%2Fapp.component.ts
  }

  delete(valor) {
    this.urls.splice(valor, 1);
    this.qtdImagens = this.urls.length;
  }

  trackArray(index) {
    this.index = index;
  }

  editarFoto(event) {
    console.log(this.index);
   if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        var image = new Image();
        reader.onload = (event: any) => {
          image.src = event.target.result;  
          
          console.log("imagem.src: " + image.src);
          console.log("this.urls.indexOf(0): " + this.urls[0]);
          //this.urls.push(event.target.result);
         /*if(image.src == this.urls[0]){
          //this.urls.splice(indice, 1, event.target.result);   
          console.log("Depois: " + image.src );     
          //this.qtdImagens = this.urls.length;
          }*/
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }   
  
  }

}
