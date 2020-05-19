import { FiltroNotaFiscalDTO } from './../../../model/DTO/FiltroNotaFiscal.DTO';
import { ClienteService } from './../../../services/domain/cliente.service';
import { OrdemServicoDTO } from '../../../model/DTO/OrdemServico.DTO';
import { Router } from '@angular/router';
import { ResponseApi } from '../../../model/response-api';
import { NotaFiscalDTO } from '../../../model/DTO/NotaFiscal.DTO';
import { NotaFiscalService } from '../../../services/domain/nota-fiscal.service';
import { Component, OnInit } from '@angular/core';
import { ClienteDTO } from '../../../model/DTO/Cliente.DTO';

@Component({
  selector: 'app-list-nota-fiscal',
  templateUrl: './list-nota-fiscal.component.html',
  styleUrls: ['./list-nota-fiscal.component.css']
})
export class ListNotaFiscalComponent implements OnInit {

  notasFiscais = new Array<NotaFiscalDTO>();
  ordemServico = new OrdemServicoDTO();
  clientes = new Array<ClienteDTO>();
  filtros: FiltroNotaFiscalDTO;
  filtrocliente: string;
  filtroTransportadora:string;
  filtroSetorDestino:string;
  wbs:string = "WBS";
  ids:Ids;
  loading:boolean = false;
  
  constructor(
      public notaFiscalService: NotaFiscalService,
      public clienteService: ClienteService,
      private router: Router
  ) { }

  ngOnInit() {
    this.getFiltros();
    this.filtroCliente(); 
 }

  valorWbs(wbs: string){
    this.wbs = wbs;
    console.log(this.wbs);
  }

  ListNotaFiscal(){
    this.loading = false;
    this.notaFiscalService.findAll().subscribe((responseApi: NotaFiscalDTO[]) => {
      this.notasFiscais = responseApi['content'];
      this.loading = true;
    }, error => { });
  }

  getFiltros(){
    this.notaFiscalService.getFiltros().subscribe((responseApi: FiltroNotaFiscalDTO) => {
      this.filtros = responseApi;
      this.filtroSetorDestino = this.filtros.setorDestinos[0];
      this.filtroTransportadora = this.filtros.transportadoras[0];
      this.ListNotaFiscal();
    }, error => { });
  }

  filtroCliente(){
    this.clienteService.findAll().subscribe((responseApi: ClienteDTO[]) => {
      this.clientes = responseApi;
      this.filtrocliente = this.clientes[0].id;
    }, error => { });
  }

  editarNotaFiscal(id: number){
    this.router.navigate(['/new_nota_fiscal',id]);
  }

  removerNotaFiscal(id: number){
    this.loading = false;
    this.notaFiscalService.delete(id).subscribe((responseApi: NotaFiscalDTO[]) => {
    this.ListNotaFiscal();
    }, error => { });
  }
}

export class Ids {
  constructor(
      public idEquipamento: string,
      public idNotaFiscal: string){}
}
