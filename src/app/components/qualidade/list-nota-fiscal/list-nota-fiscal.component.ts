import { OrdemServicoDTO } from '../../../model/DTO/OrdemServico.DTO';
import { Router } from '@angular/router';
import { ResponseApi } from '../../../model/response-api';
import { NotaFiscalDTO } from '../../../model/DTO/NotaFiscal.DTO';
import { NotaFiscalService } from '../../../services/domain/nota-fiscal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-nota-fiscal',
  templateUrl: './list-nota-fiscal.component.html',
  styleUrls: ['./list-nota-fiscal.component.css']
})
export class ListNotaFiscalComponent implements OnInit {

  notasFiscais = new Array<NotaFiscalDTO>();
  ordemServico = new OrdemServicoDTO();
  wbs:string = "WBS";
  ids:Ids;
  loading:boolean = false;
  
  constructor(
      public notaFiscalService: NotaFiscalService,
      private router: Router
  ) { }

  ngOnInit() {
    this.ListNotaFiscal();
    
  }

  valorWbs(wbs: string){
    this.wbs = wbs;
    console.log(this.wbs);
  }

  salvarOrdem(){

  }

  fecharModalEquipamento(){

  }

  ListNotaFiscal(){
    this.loading = false;
    this.notaFiscalService.findAll().subscribe((responseApi: NotaFiscalDTO[]) => {
      this.notasFiscais = responseApi;
      this.loading = true;
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
