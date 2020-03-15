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
    // Don't forget, that there are CORS-Restrictions. So if you want to run it without a Server in your Browser you need to transform the image to a dataURL
// Use http://dataurl.net/#dataurlmaker
var doc = new jsPDF();
doc.cell(5, 5, 55, 18, " ", 2, "center");

doc.cell(5, 5, 12, 18, " ", 2, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setFontStyle("bold");
doc.text("RIR:", 63, 20);

doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("17770059", 85, 20, null, null, "center");

doc.addImage("https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png", "JPEG", 6, 6, 52, 15);


doc.setDrawColor(0);
doc.setFontSize(10);
doc.setFontStyle("bold");
doc.text("RIR:", 63, 20);

doc.cell(5, 5, 30, 18, " ", 2, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("17770059", 85, 20, null, null, "center");

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

doc.addImage("https://inspecoes.s3-sa-east-1.amazonaws.com/petrobras.png", "JPEG", 153, 6, 52, 15);
doc.cell(5, 5, 55, 18, " ", 2, "center");

doc.cell(5, 7, 17, 7, " ", 3, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Cliente:", 6, 28);

doc.cell(5, 5, 42, 7, " ", 3, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("PETROBRAS", 42, 28, null, null, "center");

doc.cell(5, 8, 38, 7, " ", 3, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Contrato Jurídico:", 68, 28);

doc.cell(5, 5, 42, 7, " ", 3, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("5125.0107201.18.2", 122, 28, null, null, "center");

doc.cell(5, 8, 22, 7, " ", 3, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Cont. SAP", 146, 28);

doc.cell(5, 5, 41, 7, " ", 3, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("EQUIP - 4600566276", 186, 28, null, null, "center");

//Terçeira linha

doc.cell(5, 7, 27, 7, " ", 4, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Equipamento:", 6, 36);

doc.cell(5, 5, 134, 7, " ", 4, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("TRANSPORTATION SKID ASSDDDDDDDDDDDDDY, F/ TREE CA", 100, 36, null, null, "center");

doc.cell(5, 7, 12, 7, " ", 4, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("BP:", 169, 36);

doc.cell(5, 5, 29, 7, " ", 4, "center");
doc.setTextColor("0000FF");
doc.setLineWidth(1);
doc.line(182, 35, 205, 35);

//Quarta linha
doc.setLineWidth(0,5);
doc.cell(5, 7, 9, 7, " ", 5, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("NP:", 6, 43);

doc.cell(5, 5, 32, 7, " ", 5, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("P7000035827", 29, 43, null, null, "center");

doc.cell(5, 7, 14, 7, " ", 5, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("NS:", 49, 43);

doc.cell(5, 5, 42, 7, " ", 5, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("2017-09-0124B", 80, 43, null, null, "center");

doc.cell(5, 7, 14, 7, " ", 5, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("TAG:", 105, 43);

doc.cell(5, 5, 50, 7, " ", 5, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("FC-483", 141, 43, null, null, "center");

doc.cell(5, 7, 25, 7, " ", 5, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Família/Tipo:", 167, 43);

doc.cell(5, 5, 16, 7, " ", 5, "center");
doc.setTextColor("0000FF");
doc.setLineWidth(1);
doc.line(192, 42, 205, 42);

//Quinta linha

doc.setLineWidth(0,5);
doc.cell(5, 7, 9, 7, " ", 6, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("NF:", 6, 49);

doc.cell(5, 5, 27, 7, " ", 6, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("183", 29, 49, null, null, "center");

doc.cell(5, 7, 10, 7, " ", 6, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("RT:", 43, 49);

doc.cell(5, 5, 37, 7, " ", 6, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("319226547", 70, 49, null, null, "center");

doc.cell(5, 7, 28, 7, " ", 6, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Data Entrada:", 89, 49);

doc.cell(5, 5, 42, 7, " ", 6, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("09/01/2020", 137, 49, null, null, "center");

doc.cell(5, 7, 20, 7, " ", 6, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Origem:", 160, 49);

doc.cell(5, 5, 29, 7, " ", 6, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000FF");
doc.text("09/01/2020", 193, 49, null, null, "center");

//Lingada titulo

doc.setDrawColor(0);
doc.setFillColor(255, 255, 0);
doc.rect(5, 51, 202, 7, "FD");
doc.setTextColor("00000");
doc.text("LINGADA", 101, 57);

//Lingada corpo

doc.cell(5, 7, 0, 7, " ", 7, "center");
doc.cell(5, 7, 67.3, 7, " ", 8, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Oricccccccccccccgem:", 40, 63, null, null, "center");

doc.cell(5, 7, 67.3, 7, " ", 8, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Origem:", 110, 63, null, null, "center");

doc.cell(5, 7, 67.3, 7, " ", 8, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Origem:", 175, 63, null, null, "center");

//Lingada corpo 2º linha

doc.cell(5, 7, 67.3, 7, " ", 9, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Oricccccccccccccgem:", 40, 70, null, null, "center");

doc.cell(5, 7, 67.3, 7, " ", 9, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Origem:", 110, 70, null, null, "center");

doc.cell(5, 7, 67.3, 7, " ", 9, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Origem:", 175, 70, null, null, "center");

// Linha cobrindo as 2 colunas

doc.setLineWidth(1);
doc.line(5, 58, 207, 72);

// Linha cobrindo a ultima colunas

doc.setLineWidth(1);
doc.line(5, 65, 207, 72);

//Acessorio titulo

doc.setLineWidth(0.5);
doc.setDrawColor(0);
doc.setFillColor(255, 255, 0);
doc.rect(5, 72, 202, 7, "FD");
doc.setTextColor("00000");
doc.text("ACESSÓRIOS E COMPONENTES", 80, 77);

//Acessorio corpo

doc.cell(5, 7, 0, 7, " ", 7, "center");
doc.cell(5, 7, 112, 7, " ", 10, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("DESCRIÇÃO", 65, 84, null, null, "center");

doc.cell(5, 7, 30, 7, " ", 10, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("PN", 132, 84, null, null, "center");

doc.cell(5, 7, 30, 7, " ", 10, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("NS", 162, 84, null, null, "center");

doc.cell(5, 7, 30, 7, " ", 10, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Origem", 192, 84, null, null, "center");

//Lingada corpo 1º linha

doc.cell(5, 7, 112, 7, " ", 11, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("DESCRIÇÃO", 65, 84, null, null, "center");

doc.cell(5, 7, 30, 7, " ", 11, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("PN", 132, 84, null, null, "center");

doc.cell(5, 7, 30, 7, " ", 11, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("NS", 162, 84, null, null, "center");

doc.cell(5, 7, 30, 7, " ", 11, "center");
doc.setDrawColor(0);
doc.setFontSize(10);
doc.setTextColor("0000");
doc.setFontStyle("bold");
doc.text("Origem", 192, 84, null, null, "center");

// Linha cobrindo as 2 colunas

doc.setLineWidth(1);
doc.line(5, 79, 207, 92);

// Linha cobrindo a ultima colunas

doc.setLineWidth(1);
doc.line(5, 86, 207, 92);

//Fotos titulo

doc.setLineWidth(0.5);
doc.setDrawColor(0);
doc.setFillColor(255, 255, 0);
doc.rect(5, 93, 202, 7, "FD");
doc.setTextColor("00000");
doc.text("FOTOS", 104, 98);

// Corpo Fotos

doc.setLineWidth(0.5);
doc.setDrawColor(0);
doc.setFillColor(255, 255, 0);
doc.rect(11, 102, 95, 7, "FD");
doc.setTextColor("00000");
doc.text("FOTOS 1", 53, 107);

doc.setLineWidth(0.5);
doc.setDrawColor(0);
doc.setFillColor(255, 255, 0);
doc.rect(106, 102, 95, 7, "FD");
doc.setTextColor("00000");
doc.text("FOTOS 1", 155, 107);

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
