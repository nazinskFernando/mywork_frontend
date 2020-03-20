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

  getBase64Image(imgUrl) {
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

     console.log('tag', this.inspecao);
    
    var technipFmc = await this.getBase64Image(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png"
    );
    var petrobras = await this.getBase64Image(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/petrobras.png"
    );

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
    doc.text("17770059", 85, 20, null, null, "center");// FALTA

    doc.addImage(
      technipFmc,
      "PNG",
      6,
      6,
      52,
      15
    );

    doc.cell(5, 5, 30, 18, " ", 2, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(" ", 85, 20, null, null, "center");

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
    doc.text("14/01/2020", 125, 20);//FALTA

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(60, 5, 92, 9, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    doc.addImage(
      petrobras,
      "PNG",
      153,
      6,
      52,
      15
    );
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
    doc.text(this.inspecao.equipamento.cliente.nome, 42, 28, null, null, "center");

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
    doc.text("5125.0107201.18.2", 122, 28, null, null, "center");//faltaZ

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
    doc.text("EQUIP - 4600566276", 186, 28, null, null, "center");//falta

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
    doc.text(
      this.inspecao.equipamento.descricao,
      100,
      36,
      null,
      null,
      "center"
    );

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
    doc.setLineWidth(0.5);
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
    doc.text(this.inspecao.equipamento.partNumber, 29, 43, null, null, "center");

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
    doc.text(this.inspecao.equipamento.serialNumber, 80, 43, null, null, "center");

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
    doc.text("FC-483", 141, 43, null, null, "center");//falta

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

    doc.setLineWidth(0.5);
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
    doc.text(this.inspecao.notaFiscal.numeroNotaFiscal, 29, 49, null, null, "center");

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
    doc.text(this.inspecao.notaFiscal.rt, 70, 49, null, null, "center");

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
    doc.text(this.inspecao.notaFiscal.dataEntrada, 137, 49, null, null, "center");

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
    doc.text(this.inspecao.notaFiscal.origem, 193, 49, null, null, "center");

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
    doc.text("CÓDIGO PETROBRAS", 40, 63, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 8, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Nº DO CERTIFICADO", 110, 63, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 8, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DATA DA CERTIFICAÇÃO", 175, 63, null, null, "center");

    //Lingada corpo 2º linha

    doc.cell(5, 7, 67.3, 7, " ", 9, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Oricccccccccccccgem:", 40, 70, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 9, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 110, 70, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 9, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 175, 70, null, null, "center");

    //Lingada corpo 3º linha

    doc.cell(5, 7, 67.3, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Oricccccccccccccgem:", 40, 77, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 110, 77, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 10, "center");
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

    doc.cell(5, 7, 0, 7, " ", 7, "center");
    doc.cell(5, 7, 112, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DESCRIÇÃO", 65, 91, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("PN", 132, 91, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS", 162, 91, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem", 192, 91, null, null, "center");

    //Acessorio corpo 1º linha

    doc.cell(5, 7, 112, 7, " ", 11, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("DESCRIÇÃO", 65, 99, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 11, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("PN", 132, 99, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 11, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("NS", 162, 99, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 11, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem", 192, 99, null, null, "center");

    //Acessorio corpo 2º linha

    doc.cell(5, 7, 112, 7, " ", 12, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("DESCRIÇÃO", 65, 106, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 12, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("PN", 132, 106, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 12, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("NS", 162, 106, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 12, "center");
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
    doc.addImage(technipFmc, "PNG", 11, 123, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 116, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 2", 145, 121);

    // quadrante de foto

    doc.rect(106, 123, 95, 65);
    doc.addImage(technipFmc, "PNG", 106, 123, 95, 65);

    // Corpo Fotos

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(11, 188, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 3", 53, 193);
    // quadrante de foto

    doc.rect(11, 195, 95, 65);
    doc.addImage(technipFmc, "PNG", 11, 195, 95, 65);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(106, 188, 95, 7, "FD");
    doc.setTextColor("00000");
    doc.text("FOTOS 4", 145, 193);

    // quadrante de foto

    doc.rect(106, 195, 95, 65);
    doc.addImage(technipFmc, "PNG", 106, 195, 95, 65);

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
    doc.rect(5, 5, 55, 17, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(60, 13, 13, 9, "FD");
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("RIR:", 63, 20);

    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(72, 13, 30, 9, "FD");
    doc.setTextColor("0000FF");
    doc.text("17770059", 85, 20, null, null, "center");

    doc.addImage(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/technipfmc.png",
      "JPEG",
      6,
      6,
      52,
      15
    );
    doc.setFillColor(255, 255, 255);
    doc.rect(152, 5, 55, 17, "FD");

    
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFillColor(255, 255, 255);
    doc.rect(102, 13, 15, 9, "FD");
    doc.setFontStyle("bold");
    doc.text("DATA:", 105, 20);

    
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setFillColor(255, 255, 255);
    doc.rect(117, 13, 35, 9, "FD");
    doc.setTextColor("0000FF");
    doc.text("14/01/2020", 125, 20);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 0);
    doc.rect(60, 5, 92, 9, "FD");
    doc.setTextColor("0000");
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE INSPEÇÃO DE RECEBIMENTO", 65, 10);

    doc.addImage(
      "https://inspecoes.s3-sa-east-1.amazonaws.com/petrobras.png",
      "JPEG",
      153,
      6,
      52,
      15
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 22, 17, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cliente:", 6, 28);

    doc.setFillColor(255, 255, 255);
    doc.rect(22, 22, 43, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("PETROBRAS", 42, 28, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(65, 22, 37, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Contrato Jurídico:", 68, 28);

    doc.setFillColor(255, 255, 255);
    doc.rect(102, 22, 43, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("5125.0107201.18.2", 122, 28, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(145, 22, 20, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Cont. SAP", 146, 28);

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 22, 42, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("EQUIP - 4600566276", 186, 28, null, null, "center");

    //Terçeira linha

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 29, 27, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Equipamento:", 6, 34);

    doc.setFillColor(255, 255, 255);
    doc.rect(32, 29, 133, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text(
      "TRANSPORTATION SKID ASSDDDDDDDDDDDDDY, F/ TREE CA",
      100,
      34,
      null,
      null,
      "center"
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 29, 13, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("BP:", 169, 34);

    doc.setFillColor(255, 255, 255);
    doc.rect(178, 29, 29, 7, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(182, 34, 205, 34);

    //Quarta linha
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 36, 9, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NP:", 6, 42);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 36, 33, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("P7000035827", 29, 42, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(47, 36, 12, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS:", 49, 42);

    doc.setFillColor(255, 255, 255);
    doc.rect(59, 36, 43, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("2017-09-0124B", 80, 42, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(102, 36, 15, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("TAG:", 105, 42);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 36, 48, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("FC-483", 141, 42, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(165, 36, 26, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Família/Tipo:", 167, 42);

    doc.setFillColor(255, 255, 255);
    doc.rect(191, 36, 16, 7, "FD");
    doc.setTextColor("0000FF");
    doc.setLineWidth(1);
    doc.line(192, 41, 205, 41);

    //Quinta linha

    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 43, 9, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NF:", 6, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 43, 26, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("183", 29, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(40, 43, 11, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("RT:", 43, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(51, 43, 37, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("319226547", 70, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(88, 43, 29, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Data Entrada:", 89, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(117, 43, 42, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000FF");
    doc.text("09/01/2020", 137, 49, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.rect(159, 43, 20, 7, "FD");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem:", 160, 49);

    doc.setFillColor(255, 255, 255);
    doc.rect(179, 43, 28, 7, "FD");
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
    doc.text("CÓDIGO PETROBRAS", 40, 63, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 8, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Nº DO CERTIFICADO", 110, 63, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 8, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DATA DA CERTIFICAÇÃO", 175, 63, null, null, "center");

    //Lingada corpo 2º linha

    doc.cell(5, 7, 67.3, 7, " ", 9, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Oricccccccccccccgem:", 40, 70, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 9, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 110, 70, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 9, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 175, 70, null, null, "center");

    //Lingada corpo 3º linha

    doc.cell(5, 7, 67.3, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Oricccccccccccccgem:", 40, 77, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem:", 110, 77, null, null, "center");

    doc.cell(5, 7, 67.3, 7, " ", 10, "center");
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

    doc.cell(5, 7, 0, 7, " ", 7, "center");
    doc.cell(5, 7, 112, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("DESCRIÇÃO", 65, 91, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("PN", 132, 91, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("NS", 162, 91, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 10, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.text("Origem", 192, 91, null, null, "center");

    //Acessorio corpo 1º linha

    doc.cell(5, 7, 112, 7, " ", 11, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("DESCRIÇÃO", 65, 99, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 11, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("PN", 132, 99, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 11, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("NS", 162, 99, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 11, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("Origem", 192, 99, null, null, "center");

    //Acessorio corpo 2º linha

    doc.cell(5, 7, 112, 7, " ", 12, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("DESCRIÇÃO", 65, 106, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 12, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("PN", 132, 106, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 12, "center");
    doc.setDrawColor(0);
    doc.setFontSize(10);
    doc.setTextColor("0000");
    doc.setFontStyle("bold");
    doc.setTextColor("0000FF");
    doc.text("NS", 162, 106, null, null, "center");

    doc.cell(5, 7, 30, 7, " ", 12, "center");
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
