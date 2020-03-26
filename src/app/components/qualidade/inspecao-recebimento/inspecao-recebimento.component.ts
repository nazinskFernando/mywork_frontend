import { async } from "@angular/core/testing";
import { LaudoService } from "./../../../services/domain/laudo.service";
import { LaudoDTO } from "./../../../model/DTO/Laudo.DTO";
import { ResponseApi } from "./../../../model/response-api";
import { InspecaoDTO } from "./../../../model/DTO/Inspecao.DTO";
import { InspecaoService } from "./../../../services/domain/inspecao.service";
import { Ids } from "./../list-nota-fiscal/list-nota-fiscal.component";
import { EquipamentoNotaFiscalDTO } from "./../../../model/DTO/EquipamentoNotaFiscal.DTO";
import { NotaFiscalService } from "./../../../services/domain/nota-fiscal.service";
import { NotaFiscalDTO } from "./../../../model/DTO/NotaFiscal.DTO";
import { EquipamentoDTO } from "./../../../model/DTO/Equipamento.DTO";
import { Component, OnInit } from "@angular/core";
import { EquipamentoService } from "../../../services/domain/equipamento.service";
import { ActivatedRoute } from "@angular/router";
import * as jsPDF from "jspdf";

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
  equipamentoNotaFisca: EquipamentoNotaFiscalDTO;

  equipamento: EquipamentoDTO;
  notaFiscal: NotaFiscalDTO;
  inspecao: InspecaoDTO;
  laudos = new Array<LaudoDTO>();
  laudo = new LaudoDTO("", "", null, null, null);
  equipamentoId: string;
  notaFiscalId: string;

  isRelatorio: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private laudoService: LaudoService,
    private inspecaoService: InspecaoService
  ) {}

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




  async gerarRelatorio() {     
    
    var technipFmc = await this.getBase64Image("https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png");
    var cliente = "data:image/jpg;charset=utf-8;base64, " + this.inspecao.equipamento.cliente.imagem;
   
    
    var doc = new jsPDF();

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 5, 55, 18, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(60, 11, 13, 9, "FD");
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("RIR:", 63, 18);

    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(73, 11, 30, 9, "FD");
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.numeroRelatorio, 85, 18, null, null, "center");

    doc.addImage(
      technipFmc,
      "PNG",
      6,
      6,
      52,
      10
    );
    doc.setFillColor(255, 255, 255);
    doc.rect(152, 5, 55, 18, "FD");

    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFillColor(255, 255, 255);
    doc.rect(103, 11, 15, 9, "FD");
    doc.setFontStyle("bold");
    doc.text("DATA:", 105, 18);

    
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(117, 11, 35, 9, "FD");
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.dataInspecao, 125, 18);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(60, 5, 92, 8, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    doc.addImage(
      cliente,
      "PNG",
      153,
      6,
      52,
      10
    );

    



    doc.setFillColor(255, 255, 255);
    doc.rect(5, 19, 17, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cliente:", 6, 25);

    doc.setFillColor(255, 255, 255);
    doc.rect(22, 19, 43, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.equipamento.cliente.nome, 42, 25, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(65, 19, 38, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Contrato Jurídico:", 68, 25);

    doc.setFillColor(255, 255, 255);
    doc.rect(103, 19, 44, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("5125.0107201.18.2", 122, 25, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(145, 19, 20, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cont. SAP", 146, 25);

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 19, 42, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("EQUIP - 4600566276", 186, 25, null, null, "center");

    //Terçeira linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 27, 27, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Equipamento:", 6, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(32, 27, 133, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(
      this.inspecao.equipamento.descricao,
      100,
      33,
      null,
      null,
      "center"
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 27, 13, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("BP:", 169, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(178, 27, 29, 8, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(182, 32, 205, 32);

    //Quarta linha
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 35, 9, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NP:", 6, 41);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 35, 33, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.equipamento.partNumber, 29, 41, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(47, 35, 12, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS:", 49, 41);

    doc.setFillColor(255, 255, 255);
    doc.rect(59, 35, 43, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.equipamento.serialNumber, 80, 41, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(102, 35, 15, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("TAG:", 105, 41);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 35, 48, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("FC-483", 141, 41, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 35, 26, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Família/Tipo:", 167, 41);

    doc.setFillColor(255, 255, 255);
    doc.rect(191, 35, 16, 8, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(192, 40, 205, 40);

    //Quinta linha

    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 43, 9, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NF:", 6, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 43, 26, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.notaFiscal.numeroNotaFiscal, 29, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(40, 43, 11, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("RT:", 43, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(51, 43, 37, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.notaFiscal.rt, 70, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(88, 43, 29, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Data Entrada:", 89, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 43, 42, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.notaFiscal.dataEntrada, 137, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(159, 43, 20, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem:", 160, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(179, 43, 28, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(this.inspecao.notaFiscal.origem, 193, 49, null, null, "center");
    
    //Lingada titulo

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 51, 202, 7, "FD");
    doc.setTextColor("00000");
    doc.text("LINGADA", 101, 57);

    //Lingada corpo

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 58, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("CÓDIGO PETROBRAS", 40, 63, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(72.3, 58, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Nº DO CERTIFICADO", 110, 63, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(139.6, 58, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DATA DA CERTIFICAÇÃO", 175, 63, null, null, "center");

    //Lingada corpo 2º linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 65, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Oricccccccccccccgem:", 40, 70, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(72.3, 65, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 110, 70, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(139.6, 65, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 175, 70, null, null, "center");

    //Lingada corpo 3º linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 72, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Oricccccccccccccgem:", 40, 77, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(72.3, 72, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 110, 77, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(139.6, 72, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 175, 77, null, null, "center");

    // Linha cobrindo as 2 colunas

    doc.setLineWidth(1);
    doc.line(5, 66, 207, 79);

    // Linha cobrindo a ultima colunas

    doc.setLineWidth(1);
    doc.line(5, 72, 207, 79);

    //Acessorio titulo

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 79, 202, 7, "FD");
    doc.setTextColor("00000");
    doc.text("ACESSÓRIOS E COMPONENTES", 80, 84);

    //Acessorio corpo titulo

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 86, 112, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DESCRIÇÃO", 65, 91, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 86, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("PN", 132, 91, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(147, 86, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS", 162, 91, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(177, 86, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem", 192, 91, null, null, "center");

    //Acessorio corpo 1º linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 93, 112, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("DESCRIÇÃO", 65, 99, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 93, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("PN", 132, 99, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(147, 93, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("NS", 162, 99, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(177, 93, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem", 192, 99, null, null, "center");

    //Acessorio corpo 2º linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 100, 112, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("DESCRIÇÃO", 65, 106, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 100, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("PN", 132, 106, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(147, 100, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("NS", 162, 106, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(177, 100, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem", 192, 106, null, null, "center");

    // Linha cobrindo as 2 colunas

    doc.setLineWidth(1);
    doc.line(5, 94, 207, 107);

    // Linha cobrindo a ultima colunas

    doc.setLineWidth(1);
    doc.line(5, 100, 207, 107);

    //Fotos titulo

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 107, 202, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS", 104, 112);

    // Corpo Fotos

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(11, 116, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 1", 53, 121);
    // quadrante de foto

    doc.rect(11, 123, 95, 65);
    doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.inspecao.laudos[0].imagem, "PNG", 11, 123, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 116, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 2", 145, 121);

    // quadrante de foto

    doc.rect(106, 123, 95, 65);
    doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.inspecao.laudos[0].imagem, "PNG", 106, 123, 95, 65);

    // Corpo Fotos

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(11, 188, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 3", 53, 193);
    // quadrante de foto

    doc.rect(11, 195, 95, 65);
    doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.inspecao.laudos[1].imagem, "PNG", 11, 195, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 188, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 4", 145, 193);

    // quadrante de foto

    doc.rect(106, 195, 95, 65);
    doc.addImage("data:image/jpg;charset=utf-8;base64, " + this.inspecao.laudos[1].imagem, "PNG", 106, 195, 95, 65);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 262, 101, 7, "FD");
    doc.setTextColor("00000");
    doc.text("ASSINATURA CONTRATADA", 36, 267);
    doc.rect(5, 269, 101, 15);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 262, 101, 7, "FD");
    doc.setTextColor("00000");
    doc.text("ASSINATURA PETROBRAS", 138, 267);
    doc.rect(106, 269, 101, 15);

    // ULTIMA LINHA

    doc.rect(5, 284, 30, 7);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("DATA:", 12, 290, null, null, "center");

    doc.rect(35, 284, 71, 7);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("14/01/2020", 70, 290, null, null, "center");

    doc.rect(106, 284, 30, 7);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("DATA:", 113, 290, null, null, "center");

    doc.rect(136, 284, 71, 7);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("14/01/2020", 170, 290, null, null, "center");

    doc.rect(5, 284, 202, 11);
    doc.setFontSize(7);
    doc.setFontStyle("bold");
    doc.text("p. 1/3", 105, 294, null, null, "center");

    doc.save("Relatorio.pdf");

    /*
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 5, 55, 18, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(60, 11, 13, 9, "FD");
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("RIR:", 63, 18);

    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(73, 11, 30, 9, "FD");
    doc.setTextColor("0000FF");
    doc.text("17770059", 85, 18, null, null, "center");

    doc.addImage(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png",
      "JPEG",
      6,
      6,
      52,
      10
    );
    doc.setFillColor(255, 255, 255);
    doc.rect(152, 5, 55, 18, "FD");

    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFillColor(255, 255, 255);
    doc.rect(103, 11, 15, 9, "FD");
    doc.setFontStyle("bold");
    doc.text("DATA:", 105, 18);

    
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(117, 11, 35, 9, "FD");
    doc.setTextColor("0000FF");
    doc.text("14/01/2020", 125, 18);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(60, 5, 92, 8, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    doc.addImage(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/petrobras.png",
      "JPEG",
      153,
      6,
      52,
      10
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 19, 17, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cliente:", 6, 25);

    doc.setFillColor(255, 255, 255);
    doc.rect(22, 19, 43, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("PETROBRAS", 42, 25, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(65, 19, 38, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Contrato Jurídico:", 68, 25);

    doc.setFillColor(255, 255, 255);
    doc.rect(103, 19, 44, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("5125.0107201.18.2", 122, 25, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(145, 19, 20, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cont. SAP", 146, 25);

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 19, 42, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("EQUIP - 4600566276", 186, 25, null, null, "center");

    //Terçeira linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 27, 27, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Equipamento:", 6, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(32, 27, 133, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(
      "TRANSPORTATION SKID ASSDDDDDDDDDDDDDY, F/ TREE CA",
      100,
      33,
      null,
      null,
      "center"
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 27, 13, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("BP:", 169, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(178, 27, 29, 8, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(182, 32, 205, 32);

    //Quarta linha
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 35, 9, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NP:", 6, 41);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 35, 33, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("P7000035827", 29, 41, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(47, 35, 12, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS:", 49, 41);

    doc.setFillColor(255, 255, 255);
    doc.rect(59, 35, 43, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("2017-09-0124B", 80, 41, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(102, 35, 15, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("TAG:", 105, 41);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 35, 48, 9, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("FC-483", 141, 41, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 35, 26, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Família/Tipo:", 167, 41);

    doc.setFillColor(255, 255, 255);
    doc.rect(191, 35, 16, 8, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(192, 40, 205, 40);

    //Quinta linha

    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 43, 9, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NF:", 6, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 43, 26, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("183", 29, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(40, 43, 11, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("RT:", 43, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(51, 43, 37, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("319226547", 70, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(88, 43, 29, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Data Entrada:", 89, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 43, 42, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("09/01/2020", 137, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(159, 43, 20, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem:", 160, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(179, 43, 28, 8, "FD");
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

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 58, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("CÓDIGO PETROBRAS", 40, 63, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(72.3, 58, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Nº DO CERTIFICADO", 110, 63, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(139.6, 58, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DATA DA CERTIFICAÇÃO", 175, 63, null, null, "center");

    //Lingada corpo 2º linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 65, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Oricccccccccccccgem:", 40, 70, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(72.3, 65, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 110, 70, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(139.6, 65, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 175, 70, null, null, "center");

    //Lingada corpo 3º linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 72, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Oricccccccccccccgem:", 40, 77, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(72.3, 72, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 110, 77, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(139.6, 72, 67.3, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 175, 77, null, null, "center");

    // Linha cobrindo as 2 colunas

    doc.setLineWidth(1);
    doc.line(5, 66, 207, 79);

    // Linha cobrindo a ultima colunas

    doc.setLineWidth(1);
    doc.line(5, 72, 207, 79);

    //Acessorio titulo

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 79, 202, 7, "FD");
    doc.setTextColor("00000");
    doc.text("ACESSÓRIOS E COMPONENTES", 80, 84);

    //Acessorio corpo titulo

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 86, 112, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DESCRIÇÃO", 65, 91, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 86, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("PN", 132, 91, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(147, 86, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS", 162, 91, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(177, 86, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem", 192, 91, null, null, "center");

    //Acessorio corpo 1º linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 93, 112, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("DESCRIÇÃO", 65, 99, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 93, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("PN", 132, 99, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(147, 93, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("NS", 162, 99, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(177, 93, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem", 192, 99, null, null, "center");

    //Acessorio corpo 2º linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 100, 112, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("DESCRIÇÃO", 65, 106, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 100, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("PN", 132, 106, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(147, 100, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("NS", 162, 106, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(177, 100, 30, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem", 192, 106, null, null, "center");

    // Linha cobrindo as 2 colunas

    doc.setLineWidth(1);
    doc.line(5, 94, 207, 107);

    // Linha cobrindo a ultima colunas

    doc.setLineWidth(1);
    doc.line(5, 100, 207, 107);

    //Fotos titulo

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 107, 202, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS", 104, 112);

    // Corpo Fotos

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(11, 116, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 1", 53, 121);
    // quadrante de foto

    doc.rect(11, 123, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 11, 123, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 116, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 2", 145, 121);

    // quadrante de foto

    doc.rect(106, 123, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 106, 123, 95, 65);

    // Corpo Fotos

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(11, 188, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 3", 53, 193);
    // quadrante de foto

    doc.rect(11, 195, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 11, 195, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 188, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 4", 145, 193);

    // quadrante de foto

    doc.rect(106, 195, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 106, 195, 95, 65);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 262, 101, 7, "FD");
    doc.setTextColor("00000");
    doc.text("ASSINATURA CONTRATADA", 36, 267);
    doc.rect(5, 269, 101, 15);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 262, 101, 7, "FD");
    doc.setTextColor("00000");
    doc.text("ASSINATURA PETROBRAS", 138, 267);
    doc.rect(106, 269, 101, 15);

    // ULTIMA LINHA

    doc.rect(5, 284, 30, 7);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("DATA:", 12, 290, null, null, "center");

    doc.rect(35, 284, 71, 7);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("14/01/2020", 70, 290, null, null, "center");

    doc.rect(106, 284, 30, 7);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("DATA:", 113, 290, null, null, "center");

    doc.rect(136, 284, 71, 7);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("14/01/2020", 170, 290, null, null, "center");

    doc.rect(5, 284, 202, 11);
    doc.setFontSize(7);
    doc.setFontStyle("bold");
    doc.text("p. 1/3", 105, 294, null, null, "center");
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // segunda página
    
    
    
    
    
    
    
    
    
    
    
    
    doc.addPage();
    
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 5, 55, 12, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(60, 11, 13, 6, "FD");
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("RIR:", 63, 16);

    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(73, 11, 30, 6, "FD");
    doc.setTextColor("0000FF");
    doc.text("17770059", 85, 16, null, null, "center");

    doc.addImage(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png",
      "JPEG",
      6,
      6,
      52,
      10
    );
    doc.setFillColor(255, 255, 255);
    doc.rect(152, 5, 55, 12, "FD");

    
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFillColor(255, 255, 255);
    doc.rect(103, 11, 15, 6, "FD");
    doc.setFontStyle("bold");
    doc.text("DATA:", 105, 16);

    
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(117, 11, 35, 6, "FD");
    doc.setTextColor("0000FF");
    doc.text("14/01/2020", 125, 16);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(60, 5, 92, 6, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    doc.addImage(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/petrobras.png",
      "JPEG",
      153,
      6,
      52,
      10
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 17, 17, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cliente:", 6, 22);

    doc.setFillColor(255, 255, 255);
    doc.rect(22, 17, 43, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("PETROBRAS", 42, 22, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(65, 17, 37, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Contrato Jurídico:", 68, 22);

    doc.setFillColor(255, 255, 255);
    doc.rect(102, 17, 44, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("5125.0107201.18.2", 122, 22, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(145, 17, 20, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cont. SAP", 146, 22);

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 17, 42, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("EQUIP - 4600566276", 186, 22, null, null, "center");

    //Terçeira linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 23, 27, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Equipamento:", 6, 27);

    doc.setFillColor(255, 255, 255);
    doc.rect(32, 23, 133, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(
      "TRANSPORTATION SKID ASSDDDDDDDDDDDDDY, F/ TREE CA",
      100,
      28,
      null,
      null,
      "center"
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 23, 13, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("BP:", 169, 28);

    doc.setFillColor(255, 255, 255);
    doc.rect(178, 23, 29, 6, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(182, 27, 205, 27);

    //Quarta linha
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 29, 9, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NP:", 6, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 29, 33, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("P7000035827", 29, 33, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(47, 29, 12, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS:", 49, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(59, 29, 43, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("2017-09-0124B", 80, 33, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(102, 29, 15, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("TAG:", 105, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 29, 48, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("FC-483", 141, 33, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 29, 26, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Família/Tipo:", 167, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(191, 29, 16, 6, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(192, 32, 205, 32);

    //Quinta linha

    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 35, 9, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NF:", 6, 40);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 35, 26, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("183", 29, 40, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(40, 35, 11, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("RT:", 43, 40);

    doc.setFillColor(255, 255, 255);
    doc.rect(51, 35, 37, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("319226547", 70, 40, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(88, 35, 29, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Data Entrada:", 89, 40);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 35, 42, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("09/01/2020", 137, 40, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(159, 35, 20, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem:", 160, 40);

    doc.setFillColor(255, 255, 255);
    doc.rect(179, 35, 28, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("09/01/2020", 193, 40, null, null, "center");
    
    
    
       //Fotos titulo




    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 41, 202, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS", 97, 46);

    // Corpo Fotos

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(11, 49, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 5", 53, 54);
    // quadrante de foto

    doc.rect(11, 56, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 11, 56, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 49, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 6", 145, 54);

    // quadrante de foto

    doc.rect(106, 56, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 106, 56, 95, 65);

    // Corpo Fotos

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(11, 121, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 7", 53, 126);
    // quadrante de foto

    doc.rect(11, 128, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 11, 128, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 121, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 8", 145, 126);

    // quadrante de foto

    doc.rect(106, 128, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 106, 128, 95, 65);


// ultima linha de fotos

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(11, 193, 95, 6, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 9", 53, 197);
    // quadrante de foto

    doc.rect(11, 199, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 11, 199, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 193, 95, 6, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 10", 145, 197);

    // quadrante de foto

    doc.rect(106, 199, 95, 65);
    doc.addImage("examples/images/Octonyan.jpg", "JPEG", 106, 199, 95, 65);

// Assinatura
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 264, 101, 6, "FD");
    doc.setTextColor("00000");
    doc.text("ASSINATURA CONTRATADA", 36, 269);
    doc.rect(5, 270, 101, 15);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 264, 101, 6, "FD");
    doc.setTextColor("00000");
    doc.text("ASSINATURA PETROBRAS", 138, 269);
    doc.rect(106, 270, 101, 15);

    // ULTIMA LINHA

    doc.rect(5, 285, 30, 6);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("DATA:", 12, 289, null, null, "center");

    doc.rect(35, 285, 71, 6);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("14/01/2020", 70, 289, null, null, "center");

    doc.rect(106, 285, 30, 6);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("DATA:", 113, 289, null, null, "center");

    doc.rect(136, 285, 71, 6);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("14/01/2020", 170, 289, null, null, "center");

    
    doc.rect(5, 291, 202, 5);
    doc.setFontSize(7);
    doc.setFontStyle("bold");
    doc.setTextColor("0000");
    doc.text("p. 1/3", 105, 294, null, null, "center");




    // segunda página
    
    
    
    
    
    
    
    
    
    
    
    
    doc.addPage();
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 5, 55, 12, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(60, 11, 13, 6, "FD");
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("RIR:", 63, 16);

    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(73, 11, 30, 6, "FD");
    doc.setTextColor("0000FF");
    doc.text("17770059", 85, 16, null, null, "center");

    doc.addImage(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png",
      "JPEG",
      6,
      6,
      52,
      10
    );
    doc.setFillColor(255, 255, 255);
    doc.rect(152, 5, 55, 12, "FD");

    
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFillColor(255, 255, 255);
    doc.rect(103, 11, 15, 6, "FD");
    doc.setFontStyle("bold");
    doc.text("DATA:", 105, 16);

    
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(117, 11, 35, 6, "FD");
    doc.setTextColor("0000FF");
    doc.text("14/01/2020", 125, 16);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(60, 5, 92, 6, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    doc.addImage(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/petrobras.png",
      "JPEG",
      153,
      6,
      52,
      10
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 17, 17, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cliente:", 6, 22);

    doc.setFillColor(255, 255, 255);
    doc.rect(22, 17, 43, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("PETROBRAS", 42, 22, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(65, 17, 37, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Contrato Jurídico:", 68, 22);

    doc.setFillColor(255, 255, 255);
    doc.rect(102, 17, 44, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("5125.0107201.18.2", 122, 22, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(145, 17, 20, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cont. SAP", 146, 22);

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 17, 42, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("EQUIP - 4600566276", 186, 22, null, null, "center");

    //Terçeira linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 23, 27, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Equipamento:", 6, 27);

    doc.setFillColor(255, 255, 255);
    doc.rect(32, 23, 133, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(
      "TRANSPORTATION SKID ASSDDDDDDDDDDDDDY, F/ TREE CA",
      100,
      28,
      null,
      null,
      "center"
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 23, 13, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("BP:", 169, 28);

    doc.setFillColor(255, 255, 255);
    doc.rect(178, 23, 29, 6, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(182, 27, 205, 27);

    //Quarta linha
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 29, 9, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NP:", 6, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 29, 33, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("P7000035827", 29, 33, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(47, 29, 12, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS:", 49, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(59, 29, 43, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("2017-09-0124B", 80, 33, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(102, 29, 15, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("TAG:", 105, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 29, 48, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("FC-483", 141, 33, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 29, 26, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Família/Tipo:", 167, 33);

    doc.setFillColor(255, 255, 255);
    doc.rect(191, 29, 16, 6, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(192, 32, 205, 32);

    //Quinta linha

    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 35, 9, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NF:", 6, 40);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 35, 26, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("183", 29, 40, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(40, 35, 11, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("RT:", 43, 40);

    doc.setFillColor(255, 255, 255);
    doc.rect(51, 35, 37, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("319226547", 70, 40, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(88, 35, 29, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Data Entrada:", 89, 40);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 35, 42, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("09/01/2020", 137, 40, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(159, 35, 20, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem:", 160, 40);

    doc.setFillColor(255, 255, 255);
    doc.rect(179, 35, 28, 6, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("09/01/2020", 193, 40, null, null, "center");
    
    
    
       //DESCRIÇÃO DE COMPONENTES / REGISTRO DE ANORMALIDADES




    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 41, 202, 7, "FD");
    doc.setTextColor("00000");
    doc.text("DESCRIÇÃO DE COMPONENTES / REGISTRO DE ANORMALIDADES", 50, 46);

    // Laudo das fotos
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 48, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 01", 8, 53);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 48, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 01", 28, 53);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 56, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 02", 8, 62);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 56, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 01", 28, 62);
    
     doc.setFillColor(255, 255, 255);
    doc.rect(5, 64, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 03", 8, 70);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 64, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 01", 28, 70);

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 72, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 04", 8, 78);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 72, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 01", 28, 78);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 80, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 05", 8, 86);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 80, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 01", 28, 86);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 88, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 06", 8, 94);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 88, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 06", 28, 94);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 96, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 07", 8, 102);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 96, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 07", 28, 102);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 104, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 08", 8, 110);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 104, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 07", 28, 110);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 112, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 09", 8, 118);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 112, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 09", 28, 118);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 120, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 10", 8, 126);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 120, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 10", 28, 126);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 128, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 11", 8, 134);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 128, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 11", 28, 134);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 136, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 12", 8, 142);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 136, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 12", 28, 142);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 144, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 13", 8, 150);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 144, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 12", 28, 150);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 152, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 14", 8, 158);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 152, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 12", 28, 158);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 160, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 15", 8, 166);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 160, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 15", 28, 166);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 168, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 16", 8, 174);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 168, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 16", 28, 174);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 176, 22, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("FOTO 17", 8, 182);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(27, 176, 180, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("FOTO 16", 28, 182);

   //COMENTÁRIOS / OBSERVAÇÃO DA INSPEÇÃO
   
   
    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 184, 202, 8, "FD");
    doc.setTextColor("00000");
    doc.text("COMENTÁRIOS / OBSERVAÇÃO DA INSPEÇÃO", 70, 189);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 192, 114, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("INSPEÇÃO DE RECEBIMENTO CONFORME LWI70027184 REV: D", 6, 198);

    doc.setFillColor(255, 255, 255);
    doc.rect(119, 192, 32, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("EQUIP:  16552763", 120, 198);

    doc.setFillColor(255, 255, 255);
    doc.rect(151, 192, 27, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("S2:  300778489", 152, 198);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(178, 192, 29, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("OS:  1693484", 180, 198);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 200, 202, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text("CHECKLIST DE DESEMBARQUE NÃO DISPONIBILIZADO ATÉ A DATA DA INSPEÇÃO.", 6, 206);

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 208, 202, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text(" ", 6, 208);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 216, 202, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text(" ", 6, 208);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 224, 202, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text(" ", 6, 208);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 232, 202, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text(" ", 6, 208);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 240, 202, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text(" ", 6, 208);

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 248, 202, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text(" ", 6, 208);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 256, 202, 8, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.setFontStyle("bold");
    doc.text(" ", 6, 208);
// Assinatura



    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(5, 264, 101, 6, "FD");
    doc.setTextColor("00000");
    doc.text("ASSINATURA CONTRATADA", 36, 269);
    doc.rect(5, 270, 101, 15);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 264, 101, 6, "FD");
    doc.setTextColor("00000");
    doc.text("ASSINATURA PETROBRAS", 138, 269);
    doc.rect(106, 270, 101, 15);

    // ULTIMA LINHA

    doc.rect(5, 285, 30, 6);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("DATA:", 12, 289, null, null, "center");

    doc.rect(35, 285, 71, 6);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("14/01/2020", 70, 289, null, null, "center");

    doc.rect(106, 285, 30, 6);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("DATA:", 113, 289, null, null, "center");

    doc.rect(136, 285, 71, 6);
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("14/01/2020", 170, 289, null, null, "center");

    
    doc.rect(5, 291, 202, 5);
    doc.setFontSize(7);
    doc.setFontStyle("bold");
    doc.setTextColor("0000");
    doc.text("p. 3/3", 105, 294, null, null, "center");



    */
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

  abrirRelatorio() {
    window.open(
      "http://developer.porumclique.com.br/img/pdf/inspecao1.pdf",
      "_blank"
    );
  }

  ngOnInit(): void {
    const ids: Ids = JSON.parse(this.route.snapshot.params["ids"]);
    this.equipamentoId = ids.idEquipamento;
    this.notaFiscalId = ids.idNotaFiscal;
    this.findbyEquipamentoAndNotaFiscalId(ids.idEquipamento, ids.idNotaFiscal);
    //this.findbyNotaFiscalId(ids.idNotaFiscal);
  }

  findbyEquipamentoAndNotaFiscalId(
    idEquipamento: string,
    idNotaFiscal: string
  ) {
    this.inspecaoService
      .findByEquipamentoAndNfId(idEquipamento, idNotaFiscal)
      .subscribe(
        (responseApi: InspecaoDTO) => {
          this.inspecao = responseApi;
        },
        error => {}
      );
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
        this.findbyEquipamentoAndNotaFiscalId(
          this.equipamentoId,
          this.notaFiscalId
        );
      },
      error => {}
    );
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
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
}
