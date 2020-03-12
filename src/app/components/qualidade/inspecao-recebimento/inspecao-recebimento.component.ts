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
     doc.addImage("examples/images/Octonyan.jpg", "JPEG", 5, 5, 55, 18);
    doc.cell(5, 5, 55, 18, " ", 2, "center");

    doc.cell(5, 5, 12, 18, " ", 2, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("RIR:", 63, 20);

    doc.cell(5, 5, 30, 18, " ", 2, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("17770059", 80, 20);

    doc.cell(5, 5, 15, 18, " ", 2, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DATA:", 105, 20);
    
    doc.cell(5, 5, 35, 18, " ", 2, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("14/01/2020", 125, 20);
    
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(60, 5, 92, 9, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 152, 5, 55, 18);
    doc.cell(5, 5, 55, 18, " ", 2, "center");
    
    doc.cell(5, 8, 17, 9, " ", 3, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cliente:", 6, 30);
    
    doc.cell(5, 5, 42, 9, " ", 3, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("PETROBRAS", 30, 30);
    
    doc.cell(5, 8, 38, 9, " ", 3, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Contrato Jurídico:", 68, 30);
    
    doc.cell(5, 5, 42, 9, " ", 3, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("5125.0107201.18.2", 108, 30);
    
    doc.cell(5, 8, 22, 9, " ", 3, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cont. SAP", 146, 30);
    
    doc.cell(5, 5, 41, 9, " ", 3, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("EQUIP - 4600566276", 170, 30);

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
