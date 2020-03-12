import { async } from '@angular/core/testing';
import { LaudoService } from './../../../services/domain/laudo.service';
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
import * as jsPDF from 'jspdf'

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
  laudo = new LaudoDTO('','',null,null,null);
  equipamentoId: string;
  notaFiscalId: string;

  isRelatorio: Boolean= false;

  constructor(
          private route: ActivatedRoute, 
          private laudoService :LaudoService,
          private inspecaoService: InspecaoService) {
  }

   getBase64Image(imgUrl) {
     return new Promise(
      function(resolve, reject) {
  
        var img = new Image();
        img.src = imgUrl;
        img.setAttribute('crossOrigin', 'anonymous');
  
        img.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        }
        img.onerror = function() {
          reject("The image could not be loaded.");
        }
  
      });
  
  }

  async gerarRelatorio(){

   var technipFmc = await this.getBase64Image("https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png");
   var petrobras = await this.getBase64Image("https://inspecoes.s3-sa-east-1.amazonaws.com/petrobras.png");
   
    var doc = new jsPDF();
    doc.addImage(technipFmc, "JPEG", 5, 5, 55, 18);
    doc.cell(5, 5, 55, 18, " ", 2, "center");  
    doc.save('Relatorio.pdf');
  }
 
  
  criarInspecao(){
      this.gerarRelatorio();
  
  
    
    // this.inspecaoService.getRelatorio("1").subscribe(response => {
    //   console.log(response);
    //   let url = window.URL.createObjectURL(response.data);
    //   let a = document.createElement('a');
    //   document.body.appendChild(a);
    //   a.setAttribute('style', 'display: none');
    //   a.setAttribute('target', 'blank');
    //   a.href = url;
    //   a.download = response.filename;
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    //   a.remove();
    // }, error => {
    //   console.log(error);
    // });


    // this.laudoService.update(this.inspecao.laudos).subscribe((responseApi) => {
    //   this.findbyEquipamentoAndNotaFiscalId(this.equipamentoId, this.notaFiscalId);
    // }, error => { });
  }

  abrirRelatorio(){   
   window.open("http://developer.porumclique.com.br/img/pdf/inspecao1.pdf", '_blank');
  }

  ngOnInit(): void {
    const ids: Ids = JSON.parse(this.route.snapshot.params['ids']);
    this.equipamentoId = ids.idEquipamento;
    this.notaFiscalId = ids.idNotaFiscal;
    this.findbyEquipamentoAndNotaFiscalId(ids.idEquipamento, ids.idNotaFiscal);
    //this.findbyNotaFiscalId(ids.idNotaFiscal);
  }

  findbyEquipamentoAndNotaFiscalId(idEquipamento: string, idNotaFiscal: string){
    this.inspecaoService.findByEquipamentoAndNfId(idEquipamento, idNotaFiscal).subscribe((responseApi: InspecaoDTO) => {
       this.inspecao = responseApi;      
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

  // delete(valor) {
  //   this.urls.splice(valor, 1);
  //   this.qtdImagens = this.urls.length;
  // }

  delete(valor) {
      this.laudoService.delete(valor).subscribe((responseApi) => {
        this.findbyEquipamentoAndNotaFiscalId(this.equipamentoId, this.notaFiscalId);
      }, error => { });
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
