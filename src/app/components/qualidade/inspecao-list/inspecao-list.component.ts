import { FiltroInspecaoDTO } from "./../../../model/DTO/FiltroInspecao.DTO";
import { EquipamentoDTO } from "./../../../model/DTO/Equipamento.DTO";
import { NotaFiscalService } from "./../../../services/domain/nota-fiscal.service";
import { InspecaoDTO } from "./../../../model/DTO/Inspecao.DTO";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { InspecaoService } from "../../../services/domain/inspecao.service";
import { NotaFiscalDTO } from "../../../model/DTO/NotaFiscal.DTO";
import { Router } from "@angular/router";

@Component({
  selector: "app-inspecao-list",
  templateUrl: "./inspecao-list.component.html",
  styleUrls: ["./inspecao-list.component.css"],
})
export class InspecaoListComponent implements OnInit {
  @ViewChild("closeBtn") closeBtn: ElementRef;
  constructor(
    public insptecaoService: InspecaoService,
    public notaFiscalService: NotaFiscalService,
    private router: Router
  ) {}

  inspecoes = new Array<InspecaoDTO>();
  inspecao = new InspecaoDTO();
  numeroNotaFiscal: string = "1254";
  notaFiscal = new NotaFiscalDTO();
  equipamento = new EquipamentoDTO();
  idEquipamento: string;
  loading: boolean = false;
  totalPages: number = 0;
  page: number = 0;
  qtdPorPagina: number = 10;
  whatList: number = 0;
  filtros: FiltroInspecaoDTO;
  filtroStatus: number;
  filtroInspetor: string;
  filtrocliente: string;
  filtrosSelecionados = { status: 0, inspetor: "", cliente: "" };
  filtroAll: string;

  ngOnInit() {
    this.getFiltros();
  }

  getFiltros() {
    this.insptecaoService.getFiltros().subscribe(
      (responseApi: FiltroInspecaoDTO) => {
        this.filtros = responseApi;
        this.filtroStatus = this.filtros.status[0].id;
        this.filtroInspetor = this.filtros.inspetor[0].nome;
        this.filtrocliente = this.filtros.clientes[0].nome;
        this.ListInspecao();
      },
      (error) => {}
    );
  }

  filtrarStatus() {
    if (this.filtroStatus == this.filtros.status[0].id) {
      this.filtrosSelecionados.status = 0;
      this.limparAutomatico();
    } else {
      this.filtrosSelecionados.status = this.filtroStatus;
      this.listInspecaoFiltro();
    }
  }

  filtrarInspetor() {
    if (this.filtroInspetor == this.filtros.inspetor[0].nome) {
      this.filtrosSelecionados.inspetor = "";
      this.limparAutomatico();
    } else {
      this.filtrosSelecionados.inspetor = this.filtroInspetor;
      this.listInspecaoFiltro();
    }
  }

  filtrarCliente() {
    if (this.filtrocliente == this.filtros.clientes[0].nome) {
      this.filtrosSelecionados.cliente = "";
      this.limparAutomatico();
    } else {
      this.filtrosSelecionados.cliente = this.filtrocliente;
      this.listInspecaoFiltro();
    }
  }

  listInspecaoFiltro() {
    this.loading = false;
    if(this.filtrosSelecionados.status == null){
      this.filtrosSelecionados.status == 0;
    }
    this.insptecaoService
      .findAllFiltro(
        this.page,
        this.qtdPorPagina,
        "id",
        "DESC",
        this.filtrosSelecionados.status,
        this.filtrosSelecionados.inspetor,
        this.filtrosSelecionados.cliente
      )
      .subscribe(
        (responseApi: InspecaoDTO[]) => {
          this.inspecoes = responseApi["content"];
          this.page = responseApi["number"];
          this.totalPages = responseApi["totalPages"];
          this.loading = true;
          this.whatList = 0;
        },
        (error) => {}
      );
  }

  limparAutomatico() {
    if (
      this.filtroStatus == this.filtros.status[0].id &&
      this.filtroInspetor == this.filtros.inspetor[0].nome &&
      this.filtrocliente == this.filtros.clientes[0].nome
    ) {
      this.limpaFiltro();
    }
  }

  limpaFiltro() {
    this.filtrosSelecionados.cliente = "";
    this.filtrosSelecionados.status = null;
    this.filtrosSelecionados.inspetor = null;
    this.ListInspecao();
  }

  setStyle(valor: string) {
    let retorno = {
      "border-left":
        valor == "PENDENTE"
          ? "10px solid #0099CC"
          : valor == "ANDAMENTO"
          ? "10px solid #605ca8"
          : valor == "FINALIZADO"
          ? "10px solid #486925"
          : valor == "INTERROMPIDO"
          ? "10px solid #d1182b"
          : "",
    };

    return retorno;
  }

  setStyleBtn(valor: string) {
    let retorno = {
      background:
        valor == "PENDENTE"
          ? "#0099CC"
          : valor == "ANDAMENTO"
          ? "#605ca8"
          : valor == "FINALIZADO"
          ? "#486925"
          : valor == "INTERROMPIDO"
          ? "#d1182b"
          : "",
    };

    return retorno;
  }

  paginar(valor) {
    if (valor != "proximo" && valor != "anterior") {
      this.page = valor;
    } else {
      switch (valor) {
        case "proximo":
          console.log("page", this.page);
          console.log("totalPages", this.totalPages);
          if (this.page + 1 >= this.totalPages) {
            this.page = this.totalPages - 1;
          } else {
            this.page++;
          }
          break;

        case "anterior":
          if (this.page == 0) {
            this.page = 0;
          } else {
            this.page--;
          }
          break;
      }
    }
    if (this.whatList == 0) {
      this.ListInspecao();
    }
    console.log("valor", valor);
    console.log("page", this.page);
    console.log("this.whatList", this.whatList);
  }

  ListInspecao() {
    this.loading = false;
    this.insptecaoService
      .findAll(this.page, this.qtdPorPagina, "id", "DESC")
      .subscribe(
        (responseApi: InspecaoDTO[]) => {
          this.inspecoes = responseApi["content"];
          this.page = responseApi["number"];
          this.totalPages = responseApi["totalPages"];
          this.loading = true;
          this.whatList = 0;
        },
        (error) => {}
      );
  }

  getColor(status: string) {
    if (status == "PENDENTE") {
      return "color-pendente";
    }

    if (status == "ANDAMENTO") {
      return "color-analise";
    }

    if (status == "FINALIZADO") {
      return "color-finalizado";
    }
    if (status == "INTERROMPIDO") {
      return "color-interrompido";
    }
  }

  pesquisarPorNota() {
    this.loading = false;
    this.notaFiscalService.findByNumero(this.numeroNotaFiscal).subscribe(
      (responseApi: NotaFiscalDTO) => {
        this.notaFiscal = responseApi;
        this.loading = true;
      },
      (error) => {}
    );
  }

  onItemChange(equipamento: EquipamentoDTO) {
    this.inspecao.equipamento = equipamento;
  }

  incluirInspecao() {
    this.loading = false;
    this.inspecao.notaFiscal.id = this.notaFiscal.id;
    console.log("inspecao", this.inspecao);
    this.insptecaoService.inserir(this.inspecao).subscribe(
      (responseApi) => {
        this.ListInspecao();
        this.closeModal();
      },
      (error) => {}
    );
  }

  fazerInspecao(inspecaoId: string) {
    console.log("antes ", inspecaoId);
    this.router.navigate(["/inspecao_recebimento", inspecaoId]);
    //this.router.navigate(['/inspecao_recebimento', JSON.stringify(ids)]);
  }

  closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  listInspecaoFiltroString(){
    if(this.filtroAll == "" || this.filtroAll == null){
      this.ListInspecao();
    } else {
    this.loading = false;
    this.insptecaoService
      .findAllString(this.page, this.qtdPorPagina, "id", "DESC", this.filtroAll)
      .subscribe(
        (responseApi: InspecaoDTO[]) => {
          this.inspecoes = responseApi["content"];
          this.page = responseApi["number"];
          this.totalPages = responseApi["totalPages"];
          this.whatList = 2;
          this.loading = true;
        },
        (error) => {}
      );
    }
  }
}
