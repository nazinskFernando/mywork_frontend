import { ClienteDTO } from "./../../../model/DTO/Cliente.DTO";
import { FiltroNotaFiscalDTO } from "./../../../model/DTO/FiltroNotaFiscal.DTO";
import { ClienteService } from "./../../../services/domain/cliente.service";
import { OrdemServicoDTO } from "../../../model/DTO/OrdemServico.DTO";
import { Router } from "@angular/router";
import { ResponseApi } from "../../../model/response-api";
import { NotaFiscalDTO } from "../../../model/DTO/NotaFiscal.DTO";
import { NotaFiscalService } from "../../../services/domain/nota-fiscal.service";
import { Component, OnInit } from "@angular/core";
import { FiltroAuxDTO } from "../../../model/DTO/FiltroAux.DTO";

@Component({
  selector: "app-list-nota-fiscal",
  templateUrl: "./list-nota-fiscal.component.html",
  styleUrls: ["./list-nota-fiscal.component.css"],
})
export class ListNotaFiscalComponent implements OnInit {
  notasFiscais = new Array<NotaFiscalDTO>();
  ordemServico = new OrdemServicoDTO();
  clientes = new Array<ClienteDTO>();
  filtros: FiltroNotaFiscalDTO;
  filtrocliente: string;
  filtroTransportadora: string;
  filtroSetorDestino: string;
  filtroAll: string;
  filtrosSelecionados = { transportadora: "", setorDestino: "", cliente: "" };
  wbs: string = "WBS";
  ids: Ids;
  loading: boolean = false;
  page: number = 0;
  totalPages: number = 0;
  whatList: number = 0;
  qtdPorPagina: number = 10;

  constructor(
    public notaFiscalService: NotaFiscalService,
    public clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getFiltros();
  }

  valorWbs(wbs: string) {
    this.wbs = wbs;
    console.log(this.wbs);
  }

  listNotaFiscal() {
    this.loading = false;
    this.notaFiscalService.findAll(this.page, this.qtdPorPagina, "id", "ASC").subscribe(
      (responseApi: NotaFiscalDTO[]) => {
        this.notasFiscais = responseApi["content"];
        this.page = responseApi["number"];
        this.totalPages = responseApi["totalPages"];
        this.loading = true;
        this.whatList = 0;
      },
      (error) => {}
    );
  }

  paginar(valor) {
    if (valor != "proximo" && valor != "anterior") {
      this.page = valor;
    } else {
      switch (valor) {
        case "proximo":         
        
        console.log('page', this.page); 
        console.log('totalPages', this.totalPages); 
          if((this.page +1) >= this.totalPages){
            this.page = this.totalPages - 1;           
          } else {
            this.page++;           
          }
          break;

        case "anterior":
          if(this.page == 0){
            this.page = 0;
          } else {
            this.page--;
          }          
          break;
      }
    }
    if ((this.whatList == 0)) {
      this.listNotaFiscal();
    } else if ((this.whatList == 1)) {
      this.listNotaFiscalFiltro();
    } else if ((this.whatList == 2)) {
      this.listNotaFiscalFiltroString();
    }
    
    console.log("valor", valor);
    console.log('page', this.page);
    console.log('this.whatList', this.whatList);
  }

  filtrarTransportadora() {
    console.log("Transportadora", this.filtroTransportadora);
    if (this.filtroTransportadora == this.filtros.transportadoras[0].nome) {
      this.filtrosSelecionados.transportadora = "";
      this.limparAutomatico();
    } else {
      this.filtrosSelecionados.transportadora = this.filtroTransportadora;
      this.listNotaFiscalFiltro();
    }
  }

  filtrarSetorDestino() {
    console.log("filtroSetorDestino", this.filtroSetorDestino);
    if (this.filtroSetorDestino == this.filtros.setorDestinos[0].nome) {
      this.filtrosSelecionados.setorDestino = "";
      this.limparAutomatico();
    } else {
      this.filtrosSelecionados.setorDestino = this.filtroSetorDestino;
      this.listNotaFiscalFiltro();
    }
  }

  filtrarCliente() {
    if (this.filtrocliente == this.filtros.clientes[0].nome) {
      this.filtrosSelecionados.cliente = "";
      this.limparAutomatico();
    } else {
      this.filtrosSelecionados.cliente = this.filtrocliente;
      this.listNotaFiscalFiltro();
    }
  }

  listNotaFiscalFiltro() {
    this.loading = false;
    this.notaFiscalService
      .findAllFilter(
        this.page,
        this.qtdPorPagina,
        "id",
        "ASC",
        this.filtrosSelecionados.transportadora,
        this.filtrosSelecionados.setorDestino,
        this.filtrosSelecionados.cliente
      )
      .subscribe(
        (responseApi: NotaFiscalDTO[]) => {
          this.notasFiscais = responseApi["content"];
          this.page = responseApi["number"];
          this.totalPages = responseApi["totalPages"];
          this.loading = true;
          this.whatList = 1;
        },
        (error) => {}
      );
  }

  listNotaFiscalFiltroString() {
    if(this.filtroAll == "" || this.filtroAll == null){
      this.listNotaFiscal();
    } else {
    this.loading = false;
    this.notaFiscalService
      .findAllFiltroString(this.page, this.qtdPorPagina, "id", "ASC", this.filtroAll)
      .subscribe(
        (responseApi: NotaFiscalDTO[]) => {
          this.notasFiscais = responseApi["content"];
          this.page = responseApi["number"];
          this.totalPages = responseApi["totalPages"];
          this.whatList = 2;
          this.loading = true;
        },
        (error) => {}
      );
    }
  }

  limparAutomatico() {
    if (
      this.filtroTransportadora == this.filtros.transportadoras[0].nome &&
      this.filtroSetorDestino == this.filtros.setorDestinos[0].nome &&
      this.filtrocliente == this.filtros.clientes[0].nome
    ) {
      this.limpaFiltro();
    }
  }

  limpaFiltro() {
    this.filtrosSelecionados.cliente = "";
    this.filtrosSelecionados.setorDestino = null;
    this.filtrosSelecionados.transportadora = null;
    this.listNotaFiscal();
  }

  getFiltros() {
    this.notaFiscalService.getFiltros().subscribe(
      (responseApi: FiltroNotaFiscalDTO) => {
        this.filtros = responseApi;
        this.filtroSetorDestino = this.filtros.setorDestinos[0].nome;
        this.filtroTransportadora = this.filtros.transportadoras[0].nome;
        this.filtrocliente = this.filtros.clientes[0].nome;
        this.listNotaFiscal();
      },
      (error) => {}
    );
  }

  editarNotaFiscal(id: number) {
    this.router.navigate(["/new_nota_fiscal", id]);
  }

  removerNotaFiscal(id: number) {
    this.loading = false;
    this.notaFiscalService.delete(id).subscribe(
      (responseApi: NotaFiscalDTO[]) => {
        this.listNotaFiscal();
      },
      (error) => {}
    );
  }
}

export class Ids {
  constructor(public idEquipamento: string, public idNotaFiscal: string) {}
}
