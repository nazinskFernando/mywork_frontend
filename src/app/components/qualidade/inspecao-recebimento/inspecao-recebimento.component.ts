import { async } from "@angular/core/testing";
import { LaudoService } from "./../../../services/domain/laudo.service";
import { LaudoDTO } from "./../../../model/DTO/Laudo.DTO";
import { ResponseApi } from "./../../../model/response-api";
import { InspecaoDTO } from "./../../../model/DTO/Inspecao.DTO";
import { InspecaoService } from "./../../../services/domain/inspecao.service";
import { Ids } from "./../list-nota-fiscal/list-nota-fiscal.component";
import { NotaFiscalService } from "./../../../services/domain/nota-fiscal.service";
import { NotaFiscalDTO } from "./../../../model/DTO/NotaFiscal.DTO";
import { EquipamentoDTO } from "./../../../model/DTO/Equipamento.DTO";
import { Component, OnInit } from "@angular/core";
import { EquipamentoService } from "../../../services/domain/equipamento.service";
import { ActivatedRoute } from "@angular/router";
import * as jsPDF from "jspdf";
import { toUnicode } from "punycode";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { DomSanitizer } from '@angular/platform-browser';


// const URL = '/api/';
const URL = "https://evening-anchorage-3159.herokuapp.com/api/";

@Component({
  selector: "app-inspecao-recebimento",
  templateUrl: "./inspecao-recebimento.component.html",
  styleUrls: ["./inspecao-recebimento.component.css"]
})
export class InspecaoRecebimentoComponent implements OnInit {
  urls = [];
  qtdImagens: number = 0;
  index: number = 0;

  inspecao = new InspecaoDTO();
  laudos = new Array<LaudoDTO>();
  laudo = new LaudoDTO();
  equipamentoId: string;
  notaFiscalId: string;
  posicaoFoto:number = 0;
  precisaSegundaPagina: boolean = false;
  inspecaoRelatorio = new InspecaoDTO();

  isRelatorio: Boolean = false;
  laudosFotos = Array<LaudoDTO>();
  laudosFotosQuantidadeSegundaPagina: number = 5;
  fimFotos:boolean = false;

  laudosFotosQuantidadeTerceiraPagina: number = 1;
  novaTerceiraPagina:boolean = false;

  quantidadePaginas:number = 0;
  paginaCorrente:number = 1;

  doc = new jsPDF();
  inspecaoId: string;
  dataInspecao: string;
  dataEntrada: string;

  constructor(
    private route: ActivatedRoute,
    private laudoService: LaudoService,
    private inspecaoService: InspecaoService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    
    this.inspecaoId= this.route.snapshot.params["id"];   
    console.log("id parametro: ", this.inspecaoId);
    this.findbyInspecao(this.inspecaoId);
    this.findbyInspecaoRelatorio(this.inspecaoId);
  }  
 
  getBase64Image(imgUrl: string) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.src = imgUrl;
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      };
      img.onerror = function() {
        reject("The image could not be loaded.");
      };
    });
  }

  abrirRelatorio() {
    window.open(
      "http://developer.porumclique.com.br/img/pdf/inspecao1.pdf",
      "_blank"
    );
  }

  updateLaudo(laudo: LaudoDTO){
    
    this.laudoService.update(laudo)
    .subscribe(
      (responseApi: LaudoDTO) => {
      },
      error => {}
    );   
  }

  convertData(data: string){
    var dataEntrada = new Date(data),
    dia  = dataEntrada.getDate().toString().padStart(2, '0'),
    mes  = (dataEntrada.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
    ano  = dataEntrada.getFullYear();
    
    return dia+"/"+mes+"/"+ano;
  }

  findbyInspecao(inspecaoId: string) {
    this.inspecaoService
      .findById(inspecaoId)
      .subscribe(
        (responseApi: InspecaoDTO) => {
        this.inspecao = responseApi;          
        this.dataEntrada = this.convertData(this.inspecao.notaFiscal.dataEntrada);
        this.dataInspecao = this.convertData(this.inspecao.dataInspecao);

        console.log('dataEntrada', this.dataEntrada);
        console.log('dataInspecao', this.dataInspecao);
        },
        error => {}
      );
      console.log('inspecao', this.inspecao);
  }

  findbyInspecaoRelatorio(inspecaoId: string) {
    this.inspecaoService
      .findByIdRelatorio(inspecaoId)
      .subscribe(
        (responseApi: InspecaoDTO) => {
        this.inspecaoRelatorio = responseApi;
        this.dataEntrada = this.convertData(this.inspecao.notaFiscal.dataEntrada);
        this.dataInspecao = this.convertData(this.inspecao.dataInspecao);

        console.log('dataEntrada', this.dataEntrada);
        console.log('dataInspecao', this.dataInspecao);
        },
        error => {}
      );
      console.log('inspecao', this.inspecao);
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
        };
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
    this.laudoService.delete(valor).subscribe(
      responseApi => {
        this.findbyInspecao(this.inspecaoId);
      },
      error => {}
    );
  }

  // trackArray(index) {
  //   this.index = index;
  // }

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
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  async gerarRelatorio() { 
    console.log('inspeção ', this.inspecao);    
    // caso desista de gerar o relatório na segunda vez da erro por conta dessas 2 variáveis
    var technipFmc = await this.getBase64Image("https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png");
    var cliente = "data:image/jpg;charset=utf-8;base64, " + this.inspecaoRelatorio.equipamento.cliente.imagem;
   
    
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 5, 55, 18, "FD");
    this.doc.setTextColor("0000");
    this.doc.setFontSize(10);
    
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(60, 11, 13, 9, "FD");
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("RIR:", 63, 18);

    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(73, 11, 30, 9, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.ordemServico.numeroRelatorio, 85, 18, null, null, "center");

    this.doc.addImage(
      technipFmc,
      "PNG",
      6,
      6,
      52,
      10
    );
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(152, 5, 55, 18, "FD");

    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(103, 11, 15, 9, "FD");
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 105, 18);

    
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 11, 35, 9, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.text(this.dataInspecao, 125, 18);

    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(60, 5, 92, 8, "FD");
    this.doc.setTextColor("0000");
    this.doc.setFontSize(10);
    this.doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    this.doc.addImage(
      cliente,
      "PNG",
      153,
      6,
      52,
      10
    );

    



    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 19, 17, 9, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Cliente:", 6, 25);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(22, 19, 43, 9, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.cliente.nome, 42, 25, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(65, 19, 38, 9, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Contrato Jurídico:", 68, 25);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(103, 19, 44, 9, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text("5125.0107201.18.2", 122, 25, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(145, 19, 20, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Cont. SAP", 146, 25);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 19, 42, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text("EQUIP - 4600566276", 186, 25, null, null, "center");

    //Terçeira linha

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 27, 27, 9, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Equipamento:", 6, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(32, 27, 133, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(
      this.inspecaoRelatorio.equipamento.descricao,
      100,
      33,
      null,
      null,
      "center"
    );

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 27, 13, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("BP:", 169, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(178, 27, 29, 8, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.setLineWidth(1);
    this.doc.line(182, 32, 205, 32);

    //Quarta linha
    this.doc.setLineWidth(0.5);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 35, 9, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NP:", 6, 41);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(14, 35, 33, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.partNumber, 29, 41, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(47, 35, 12, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NS:", 49, 41);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(59, 35, 43, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.serialNumber, 80, 41, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(102, 35, 15, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("TAG:", 105, 41);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 35, 48, 9, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.tag, 141, 41, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 35, 26, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Família/Tipo:", 167, 41);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(191, 35, 16, 8, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.setLineWidth(1);
    this.doc.line(192, 40, 205, 40);

    //Quinta linha

    this.doc.setLineWidth(0.5);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 43, 9, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NF:", 6, 49);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(14, 43, 26, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.numeroNotaFiscal, 29, 49, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(40, 43, 11, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("RT:", 43, 49);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(51, 43, 37, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.rt, 70, 49, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(88, 43, 29, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Data Entrada:", 89, 49);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 43, 42, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.dataEntrada, 137, 49, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(159, 43, 20, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Origem:", 160, 49);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(179, 43, 28, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.origem, 193, 49, null, null, "center");
    
    //Lingada titulo

    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 51, 202, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("LINGADA", 101, 57);

    //Lingada corpo

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 58, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("CÓDIGO PETROBRAS", 40, 63, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(72.3, 58, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Nº DO CERTIFICADO", 110, 63, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(139.6, 58, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("DATA DA CERTIFICAÇÃO", 175, 63, null, null, "center");

    //Lingada corpo 2º linha

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 65, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(72.3, 65, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(139.6, 65, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    //Lingada corpo 3º linha

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 72, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(72.3, 72, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(139.6, 72, 67.3, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");    

    switch(this.inspecaoRelatorio.lingadas.length){
      case 0:
        // Linha cobrindo as 2 colunas
        this.doc.setLineWidth(1);
        this.doc.line(5, 66, 207, 79);
        break
      case 1:
        this.doc.text(this.inspecaoRelatorio.lingadas[0].codigoPetrobras, 40, 70, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.lingadas[0].numeroCertificado, 110, 70, null, null, "center");
        this.doc.text(this.convertData(this.inspecaoRelatorio.lingadas[0].dataCertificacao), 175, 70, null, null, "center");
        // Linha cobrindo a ultima colunas
        this.doc.setLineWidth(1);
        this.doc.line(5, 72, 207, 79);
        break
      case 2:
        this.doc.text(this.inspecaoRelatorio.lingadas[0].codigoPetrobras, 40, 70, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.lingadas[0].numeroCertificado, 110, 70, null, null, "center");
        this.doc.text(this.convertData(this.inspecaoRelatorio.lingadas[0].dataCertificacao), 175, 70, null, null, "center");

        this.doc.text(this.inspecaoRelatorio.lingadas[1].codigoPetrobras, 40, 77, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.lingadas[1].numeroCertificado, 110, 77, null, null, "center");    
        this.doc.text(this.convertData(this.inspecaoRelatorio.lingadas[1].dataCertificacao), 175, 77, null, null, "center");
      break
    }
    

    

    //Acessorio titulo

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 79, 202, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("ACESSÓRIOS E COMPONENTES", 80, 84);

    //Acessorio corpo titulo

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 86, 112, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("DESCRIÇÃO", 65, 91, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 86, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("PN", 132, 91, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(147, 86, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NS", 162, 91, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(177, 86, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Origem", 192, 91, null, null, "center");

    //Acessorio corpo 1º linha

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 93, 112, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 93, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(147, 93, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(177, 93, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    //Acessorio corpo 2º linha

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 100, 112, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 100, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(147, 100, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(177, 100, 30, 7, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000FF");
    
    switch(this.inspecaoRelatorio.acessoriosComponentes.length){

      case 0:
        // Linha cobrindo as 2 colunas
        this.doc.setLineWidth(1);
        this.doc.line(5, 94, 207, 107);

        break
      case 1:
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[0].descricao, 65, 99, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[0].pn, 132, 99, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[0].ns, 162, 99, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[0].bp, 192, 99, null, null, "center");
         // Linha cobrindo a ultima colunas
        this.doc.setLineWidth(1);
        this.doc.line(5, 100, 207, 107);
        break
      case 2:
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[0].descricao, 65, 99, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[0].pn, 132, 99, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[0].ns, 162, 99, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[0].bp, 192, 99, null, null, "center");

        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[1].descricao, 65, 106, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[1].pn, 132, 106, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[1].ns, 162, 106, null, null, "center");
        this.doc.text(this.inspecaoRelatorio.acessoriosComponentes[1].bp, 192, 106, null, null, "center");
        break
    }
    
   

    //Fotos titulo

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 107, 202, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("FOTOS", 104, 112);

    // Corpo Fotos

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(11, 116, 95, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("FOTOS 1", 53, 121);
    this.doc.rect(106, 123, 95, 65);
    // quadrante de foto

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(106, 116, 95, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("FOTOS 2", 145, 121);
    this.doc.rect(11, 123, 95, 65);
    // quadrante de foto    

    
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(11, 188, 95, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("FOTOS 3", 53, 193);
    this.doc.rect(11, 195, 95, 65);
    // quadrante de foto

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(106, 188, 95, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("FOTOS 4", 145, 193);
    this.doc.rect(106, 195, 95, 65);

    // quadrante de foto   

 
  for(var x=0; x < this.inspecaoRelatorio.laudos.length; x++){
    if(this.inspecaoRelatorio.laudos[x].usarRelatorio == true){
      
      this.laudosFotos.push(this.inspecaoRelatorio.laudos[x]);
      switch(this.posicaoFoto){        
          
        case 0: 
        this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.laudosFotos[0].imagem, "JPG", 11, 123, 95, 65);
        break      
        
        case 1:
        this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.laudosFotos[1].imagem, "PNG", 106, 123, 95, 65);
        break
        // Corpo Fotos
        case 2:       
          this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.laudosFotos[2].imagem, "PNG", 11, 195, 95, 65);
        break

        case 3:           
          this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.laudosFotos[3].imagem, "PNG", 106, 195, 95, 65);
        break
      }
      this.posicaoFoto++;
    }
  }

  var pagina2 = 0;
  var pagina3 = 1;


  for(var y=0; y<=x; y++){

    if(y > 4){
      if(y % 4 == 0){
        pagina2++;
      }
    }

   if(y > 17){
     if(y % 17 == 0){
      pagina3++;
     }
   }
    
  }

  this.quantidadePaginas = 1 + pagina2 + pagina3;

  console.log('paginas', this.quantidadePaginas);

  
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 262, 101, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("ASSINATURA CONTRATADA", 36, 267);
    this.doc.rect(5, 269, 101, 15);

    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(106, 262, 101, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("ASSINATURA PETROBRAS", 138, 267);
    this.doc.rect(106, 269, 101, 15);
    this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.inspecaoRelatorio.usuario.assinaturaEletronica, "PNG", 6, 269, 99, 15);

    // ULTIMA LINHA

    this.doc.rect(5, 284, 30, 7);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 12, 290, null, null, "center");

    this.doc.rect(35, 284, 71, 7);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text(this.dataInspecao, 70, 290, null, null, "center");

    this.doc.rect(106, 284, 30, 7);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 113, 290, null, null, "center");

    this.doc.rect(136, 284, 71, 7);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text(this.dataInspecao, 170, 290, null, null, "center");

    this.doc.rect(5, 284, 202, 11);
    this.doc.setFontSize(7);
    this.doc.setFontStyle("bold");
    this.doc.text("p. " + this.paginaCorrente++ + "/" + this.quantidadePaginas, 105, 294, null, null, "center");

    var valor = 1;
   if(this.laudosFotos.length >= 4){
    //  do{
    //   this.segundaPagina(technipFmc, cliente);
    //   }
    //  while(this.laudosFotos.length >= this.laudosFotosQuantidadeSegundaPagina);    
   
     while(this.laudosFotos.length > this.laudosFotosQuantidadeSegundaPagina){
      this.segundaPagina(technipFmc, cliente);
     }   
   } 
 
   do{
    this.ultimaPagina(technipFmc, cliente);
   }
   while(this.novaTerceiraPagina);
    
   this.quantidadePaginas = this.paginaCorrente;
   

    this.doc.save("Relatorio.pdf");
    
  }

  criarInspecao() {
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

  segundaPagina(technipFmc, cliente){
    this.doc.addPage();
    
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 5, 55, 12, "FD");
    this.doc.setTextColor("0000");
    this.doc.setFontSize(10);
    
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(60, 11, 13, 6, "FD");
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("RIR:", 63, 16);

    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(73, 11, 30, 6, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.ordemServico.numeroRelatorio, 85, 16, null, null, "center");

    this.doc.addImage(
      technipFmc,
      "JPEG",
      6,
      6,
      52,
      10
    );
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(152, 5, 55, 12, "FD");

    
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(103, 11, 15, 6, "FD");
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 105, 16);

    
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 11, 35, 6, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.text(this.dataInspecao, 125, 16);

    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(60, 5, 92, 6, "FD");
    this.doc.setTextColor("0000");
    this.doc.setFontSize(10);
    this.doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    this.doc.addImage(
      cliente,
      "JPEG",
      153,
      6,
      52,
      10
    );

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 17, 17, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Cliente:", 6, 22);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(22, 17, 43, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.cliente.nome, 42, 22, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(65, 17, 38, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Contrato Jurídico:", 68, 22);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(103, 17, 44, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text("5125.0107201.18.2", 122, 22, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(145, 17, 20, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Cont. SAP", 146, 22);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 17, 42, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text("EQUIP - 4600566276", 186, 22, null, null, "center");

    //Terçeira linha

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 23, 27, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Equipamento:", 6, 27);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(32, 23, 133, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(
      this.inspecaoRelatorio.equipamento.descricao,
      100,
      28,
      null,
      null,
      "center"
    );

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 23, 13, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("BP:", 169, 28);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(178, 23, 29, 6, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.setLineWidth(1);
    this.doc.line(182, 27, 205, 27);

    //Quarta linha
    this.doc.setLineWidth(0.5);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 29, 9, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NP:", 6, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(14, 29, 33, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.partNumber, 29, 33, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(47, 29, 12, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NS:", 49, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(59, 29, 43, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.serialNumber, 80, 33, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(102, 29, 15, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("TAG:", 105, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 29, 48, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text("FC-483", 141, 33, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 29, 26, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Família/Tipo:", 167, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(191, 29, 16, 6, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.setLineWidth(1);
    this.doc.line(192, 32, 205, 32);

    //Quinta linha

    this.doc.setLineWidth(0.5);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 35, 9, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NF:", 6, 40);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(14, 35, 26, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.numeroNotaFiscal, 29, 40, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(40, 35, 11, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("RT:", 43, 40);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(51, 35, 37, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.rt, 70, 40, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(88, 35, 29, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Data Entrada:", 89, 40);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 35, 42, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.dataEntrada, 137, 40, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(159, 35, 20, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Origem:", 160, 40);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(179, 35, 28, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.origem, 193, 40, null, null, "center");
    
    
    
       //Fotos titulo




    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 41, 202, 6, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("FOTOS", 97, 46);

    // Corpo Fotos

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(11, 49, 95, 6, "FD");
    this.doc.setTextColor("00000");
    
    // quadrante de foto

    this.doc.rect(11, 55, 95, 65);
    
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(106, 49, 95, 6, "FD");
    this.doc.setTextColor("00000");
    

    // quadrante de foto

    this.doc.rect(106, 55, 95, 65);
    
    // Corpo Fotos

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(11, 120, 95, 6, "FD");
    this.doc.setTextColor("00000");
   
    // quadrante de foto

    this.doc.rect(11, 126, 95, 65);
   
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(106, 120, 95, 6, "FD");
    this.doc.setTextColor("00000");
    

    // quadrante de foto

    this.doc.rect(106, 126, 95, 65);
    

// ultima linha de fotos

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(11, 191, 95, 6, "FD");
    this.doc.setTextColor("00000");
    
    // quadrante de foto

    this.doc.rect(11, 197, 95, 65);
    
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(106, 191, 95, 6, "FD");
    this.doc.setTextColor("00000");
    

    // quadrante de foto

    this.doc.rect(106, 197, 95, 65);    

    var posicaoEsquerdaDireita = "esquerda";
    var posicaoLinha = 55.5;
    var posicaoFotos = 54;
    var rodadas = 1;
    var valorx = 0;
    var x;
    
    for(x = this.laudosFotosQuantidadeSegundaPagina; x <= this.laudosFotos.length ; x++){  
        
     if((x + 1) <= this.laudosFotos.length){
        if(rodadas < 7){
          if(posicaoEsquerdaDireita == "esquerda" ){
              this.doc.text("FOTO " + x, 53, posicaoFotos);
              this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.laudosFotos[x].imagem, "PNG", 11.5, posicaoLinha, 94, 64);
              posicaoEsquerdaDireita = "direita";
            } 
            else  
            if(posicaoEsquerdaDireita == "direita"){
              this.doc.text("FOTO " + x, 145, posicaoFotos);
             this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.laudosFotos[x].imagem, "PNG", 106.5, posicaoLinha, 94, 64);
              posicaoLinha = posicaoLinha + 71;
              posicaoFotos += 71;
              posicaoEsquerdaDireita = "esquerda";
            } 
            this.fimFotos = false;
            
          } 
        if(rodadas == 6){
       
          valorx = x;
        }  
      } else {
        console.log("valor x", x);
        for(var y = rodadas; y <= 6; y++){
          
            if(posicaoEsquerdaDireita == "esquerda" ){
              this.doc.text("FOTO " + x, 53, posicaoFotos);
              posicaoEsquerdaDireita = "direita";
            } 
            else  
            if(posicaoEsquerdaDireita == "direita"){
              this.doc.text("FOTO " + x, 145, posicaoFotos);
              posicaoLinha = posicaoLinha + 71;
              posicaoFotos += 71;
              posicaoEsquerdaDireita = "esquerda";
            } 
            x++;
        }
        
      }      
      rodadas ++;
    }
    
    if(valorx != 0){
      this.laudosFotosQuantidadeSegundaPagina = valorx +1;
    } else {
      this.laudosFotosQuantidadeSegundaPagina = x;
    }
    

// Assinatura
    
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 264, 101, 6, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("ASSINATURA CONTRATADA", 36, 269);
    this.doc.rect(5, 270, 101, 15);
    this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.inspecaoRelatorio.usuario.assinaturaEletronica, "PNG", 6, 271, 99, 15);


    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(106, 264, 101, 6, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("ASSINATURA PETROBRAS", 138, 269);
    this.doc.rect(106, 270, 101, 15);

    // ULTIMA LINHA

    this.doc.rect(5, 285, 30, 6);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 12, 289, null, null, "center");

    this.doc.rect(35, 285, 71, 6);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text(this.dataInspecao, 70, 289, null, null, "center");

    this.doc.rect(106, 285, 30, 6);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 113, 289, null, null, "center");

    this.doc.rect(136, 285, 71, 6);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text(this.dataInspecao, 170, 289, null, null, "center");

    
    this.doc.rect(5, 291, 202, 5);
    this.doc.setFontSize(7);
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000");
    this.doc.text("p. " + this.paginaCorrente++ + "/" + this.quantidadePaginas, 105, 294, null, null, "center");

  }

  ultimaPagina(technipFmc, cliente){
    this.doc.addPage();
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 5, 55, 12, "FD");
    this.doc.setTextColor("0000");
    this.doc.setFontSize(10);
    
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(60, 11, 13, 6, "FD");
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("RIR:", 63, 16);

    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(73, 11, 30, 6, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.ordemServico.numeroRelatorio, 85, 16, null, null, "center");

    this.doc.addImage(
      technipFmc,
      "JPEG",
      6,
      6,
      52,
      10
    );
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(152, 5, 55, 12, "FD");

    
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(103, 11, 15, 6, "FD");
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 105, 16);

    
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 11, 35, 6, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.text(this.dataInspecao, 125, 16);

    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(60, 5, 92, 6, "FD");
    this.doc.setTextColor("0000");
    this.doc.setFontSize(10);
    this.doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    this.doc.addImage(
      cliente,
      "JPEG",
      153,
      6,
      52,
      10
    );

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 17, 17, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Cliente:", 6, 22);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(22, 17, 43, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.cliente.nome, 42, 22, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(65, 17, 38, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Contrato Jurídico:", 68, 22);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(103, 17, 44, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text("5125.0107201.18.2", 122, 22, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(145, 17, 20, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Cont. SAP", 146, 22);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 17, 42, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text("EQUIP - 4600566276", 186, 22, null, null, "center");

    //Terçeira linha

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 23, 27, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Equipamento:", 6, 27);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(32, 23, 133, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(
      this.inspecaoRelatorio.equipamento.descricao,
      100,
      28,
      null,
      null,
      "center"
    );

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 23, 13, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("BP:", 169, 28);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(178, 23, 29, 6, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.setLineWidth(1);
    this.doc.line(182, 27, 205, 27);

    //Quarta linha
    this.doc.setLineWidth(0.5);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 29, 9, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NP:", 6, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(14, 29, 33, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.partNumber, 29, 33, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(47, 29, 12, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NS:", 49, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(59, 29, 43, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.equipamento.serialNumber, 80, 33, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(102, 29, 15, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("TAG:", 105, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 29, 48, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text("FC-483", 141, 33, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(165, 29, 26, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Família/Tipo:", 167, 33);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(191, 29, 16, 6, "FD");
    this.doc.setTextColor("0000FF");
    this.doc.setLineWidth(1);
    this.doc.line(192, 32, 205, 32);

    //Quinta linha

    this.doc.setLineWidth(0.5);
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 35, 9, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("NF:", 6, 40);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(14, 35, 26, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.numeroNotaFiscal, 29, 40, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(40, 35, 11, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("RT:", 43, 40);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(51, 35, 37, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.rt, 70, 40, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(88, 35, 29, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Data Entrada:", 89, 40);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(117, 35, 42, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.dataEntrada, 137, 40, null, null, "center");

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(159, 35, 20, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    this.doc.text("Origem:", 160, 40);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(179, 35, 28, 6, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.text(this.inspecaoRelatorio.notaFiscal.origem, 193, 40, null, null, "center");
    
    
    
       //DESCRIÇÃO DE COMPONENTES / REGISTRO DE ANORMALIDADES




    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 41, 202, 7, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("DESCRIÇÃO DE COMPONENTES / REGISTRO DE ANORMALIDADES", 50, 46);

    // Laudo das fotos
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 48, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 48, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 56, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 56, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    
     this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 64, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 64, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");    

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 72, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");   
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 72, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");    
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 80, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 80, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 88, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 88, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 96, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 96, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 104, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 104, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 112, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 112, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 120, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 120, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 128, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 128, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 136, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 136, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 144, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 144, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 152, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 152, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 160, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 160, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 168, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 168, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 176, 22, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000");
    this.doc.setFontStyle("bold");
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(27, 176, 180, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");

    var posicao = 54;
    var posicaoIndicador=1;
    // for(var x = this.laudosFotosQuantidadeTerceiraPagina; this.laudosFotos.length > x; x++){
    for(var x = 0; this.laudosFotos.length > x; x++){
      
      if(posicaoIndicador <= 17){
        this.novaTerceiraPagina = false;
        if(x < 9){        
          var foto = "FOTO 0" + (x+1);
          this.doc.text(foto, 8, posicao);
        } else {
          var foto = "FOTO " + (x+1);
          this.doc.text(foto, 8, posicao);
        }    
        
        this.doc.text(this.laudosFotos[x].descricaoLaudo.descricao, 28, posicao);
      
        posicao += 8;
        posicaoIndicador += 1;
      } else {
        this.novaTerceiraPagina = true;
        this.laudosFotosQuantidadeTerceiraPagina = x;
      }
    }

   //COMENTÁRIOS / OBSERVAÇÃO DA INSPEÇÃO
   
   
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 184, 202, 8, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("COMENTÁRIOS / OBSERVAÇÃO DA INSPEÇÃO", 70, 189);
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 192, 114, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text("INSPEÇÃO DE RECEBIMENTO CONFORME LWI70027184 REV: D", 6, 198);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(119, 192, 32, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text("EQUIP: " + this.inspecaoRelatorio.equipamento.codEquipamento, 120, 198);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(151, 192, 27, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text("S2: " + this.inspecaoRelatorio.ordemServico.s2, 152, 198);
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(178, 192, 29, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text("OS: " + this.inspecaoRelatorio.ordemServico.numeroOrdem, 180, 198);
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 200, 202, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text("CHECKLIST DE DESEMBARQUE NÃO DISPONIBILIZADO ATÉ A DATA DA INSPEÇÃO.", 6, 206);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 208, 202, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text(" ", 6, 208);
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 216, 202, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text(" ", 6, 208);
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 224, 202, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text(" ", 6, 208);
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 232, 202, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text(" ", 6, 208);
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 240, 202, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text(" ", 6, 208);

    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 248, 202, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text(" ", 6, 208);
    
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(5, 256, 202, 8, "FD");
    this.doc.setDrawColor(0);
    this.doc.setFontSize(10);
    this.doc.setTextColor("0000FF");
    this.doc.setFontStyle("bold");
    this.doc.text(" ", 6, 208);
// Assinatura



    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(5, 264, 101, 6, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("ASSINATURA CONTRATADA", 36, 269);
    this.doc.rect(5, 270, 101, 15);
    this.doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.inspecaoRelatorio.usuario.assinaturaEletronica, "PNG", 6, 271, 99, 15);


    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 0);
    this.doc.rect(106, 264, 101, 6, "FD");
    this.doc.setTextColor("00000");
    this.doc.text("ASSINATURA PETROBRAS", 138, 269);
    this.doc.rect(106, 270, 101, 15);

    // ULTIMA LINHA

    this.doc.rect(5, 285, 30, 6);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 12, 289, null, null, "center");

    this.doc.rect(35, 285, 71, 6);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text(this.dataInspecao, 70, 289, null, null, "center");

    this.doc.rect(106, 285, 30, 6);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text("DATA:", 113, 289, null, null, "center");

    this.doc.rect(136, 285, 71, 6);
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.text(this.dataInspecao, 170, 289, null, null, "center");

    
    this.doc.rect(5, 291, 202, 5);
    this.doc.setFontSize(7);
    this.doc.setFontStyle("bold");
    this.doc.setTextColor("0000");
    this.doc.text("p. " + this.paginaCorrente++ + "/" + this.quantidadePaginas, 105, 294, null, null, "center");
  }
}

