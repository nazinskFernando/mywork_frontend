import { ChaveValor } from './../../../model/DTO/ChaveValor';
import { FiltroInspecaoDTO } from './../../../model/DTO/FiltroInspecao.DTO';
import { EquipamentoDTO } from './../../../model/DTO/Equipamento.DTO';
import { NotaFiscalService } from './../../../services/domain/nota-fiscal.service';
import { InspecaoDTO } from './../../../model/DTO/Inspecao.DTO';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { InspecaoService } from '../../../services/domain/inspecao.service';
import { NotaFiscalDTO } from '../../../model/DTO/NotaFiscal.DTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspecao-list',
  templateUrl: './inspecao-list.component.html',
  styleUrls: ['./inspecao-list.component.css'],
})
export class InspecaoListComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtnStatus') closeBtnStatus: ElementRef;
  @ViewChild('openBtnStatus') openBtnStatus: ElementRef;

  constructor(
    public inspecaoService: InspecaoService,
    public notaFiscalService: NotaFiscalService,
    private router: Router
  ) {}

  inspecoes = new Array<InspecaoDTO>();
  inspecao = new InspecaoDTO();
  numeroNotaFiscal = '1254';
  notaFiscal = new NotaFiscalDTO();
  equipamento = new EquipamentoDTO();
  idEquipamento: string;
  loading = false;
  totalPages = 0;
  page = 0;
  qtdPorPagina = 10;
  whatList = 0;
  filtros: FiltroInspecaoDTO;
  filtroStatus: number;
  filtroInspetor: string;
  filtrocliente: string;
  filtrosSelecionados = { status: 0, inspetor: '', cliente: '' };
  filtroAll: string;
  statusSelecionado: number;

  statusInspecao = new ChaveValor();

  ngOnInit() {
    this.getFiltros();
  }

  getFiltros() {
    this.inspecaoService.getFiltros().subscribe(
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
      this.filtrosSelecionados.inspetor = '';
      this.limparAutomatico();
    } else {
      this.filtrosSelecionados.inspetor = this.filtroInspetor;
      this.listInspecaoFiltro();
    }
  }

  filtrarCliente() {
    if (this.filtrocliente == this.filtros.clientes[0].nome) {
      this.filtrosSelecionados.cliente = '';
      this.limparAutomatico();
    } else {
      this.filtrosSelecionados.cliente = this.filtrocliente;
      this.listInspecaoFiltro();
    }
  }

  listInspecaoFiltro() {
    this.loading = false;
    if (this.filtrosSelecionados.status == null) {
      this.filtrosSelecionados.status == 0;
    }
    this.inspecaoService
      .findAllFiltro(
        this.page,
        this.qtdPorPagina,
        'id',
        'DESC',
        this.filtrosSelecionados.status,
        this.filtrosSelecionados.inspetor,
        this.filtrosSelecionados.cliente
      )
      .subscribe(
        (responseApi: InspecaoDTO[]) => {
          this.inspecoes = responseApi['content'];
          this.page = responseApi['number'];
          this.totalPages = responseApi['totalPages'];
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
    this.filtrosSelecionados.cliente = '';
    this.filtrosSelecionados.status = null;
    this.filtrosSelecionados.inspetor = null;
    this.ListInspecao();
  }

  setStyle(valor: string) {
    const retorno = {
      'border-left':
        valor == 'PENDENTE'
          ? '10px solid #0099CC'
          : valor == 'ANDAMENTO'
          ? '10px solid #605ca8'
          : valor == 'FINALIZADO'
          ? '10px solid #486925'
          : valor == 'INTERROMPIDO'
          ? '10px solid #d1182b'
          : '',
    };

    return retorno;
  }

  setStyleBtn(valor: string) {
    const retorno = {
      background:
        valor == 'PENDENTE'
          ? '#0099CC'
          : valor == 'ANDAMENTO'
          ? '#605ca8'
          : valor == 'FINALIZADO'
          ? '#486925'
          : valor == 'INTERROMPIDO'
          ? '#d1182b'
          : '',
    };

    return retorno;
  }

  paginar(valor) {
    if (valor != 'proximo' && valor != 'anterior') {
      this.page = valor;
    } else {
      switch (valor) {
        case 'proximo':
          if (this.page + 1 >= this.totalPages) {
            this.page = this.totalPages - 1;
          } else {
            this.page++;
          }
          break;

        case 'anterior':
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
  }

  ListInspecao() {
    this.loading = false;
    this.inspecaoService
      .findAll(this.page, this.qtdPorPagina, 'id', 'DESC')
      .subscribe(
        (responseApi: InspecaoDTO[]) => {
          this.inspecoes = responseApi['content'];
          this.page = responseApi['number'];
          this.totalPages = responseApi['totalPages'];
          this.loading = true;
          this.whatList = 0;
        },
        (error) => {}
      );
  }

  getColor(status: string) {
    if (status == 'PENDENTE') {
      return 'color-pendente';
    }

    if (status == 'ANDAMENTO') {
      return 'color-analise';
    }

    if (status == 'FINALIZADO') {
      return 'color-finalizado';
    }
    if (status == 'INTERROMPIDO') {
      return 'color-interrompido';
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

    if (this.inspecao.id == null) {
      console.log('inisert');
      this.inspecaoService.inserir(this.inspecao).subscribe(
        (responseApi) => {
          this.ListInspecao();
          this.closeModal();
        },
        (error) => {}
      );
    } else {
      console.log('update');
      const inspecaoAux = new InspecaoDTO();
      inspecaoAux.id = this.inspecao.id;
      inspecaoAux.equipamento = this.inspecao.equipamento;
      inspecaoAux.ordemServico = this.inspecao.ordemServico;
      this.inspecaoService.update(inspecaoAux).subscribe(
        (responseApi) => {
          this.ListInspecao();
          this.closeModal();
        },
        (error) => {}
      );
    }
  }

  fazerInspecao(inspecaoId: string) {
    this.router.navigate(['/inspecao_recebimento', inspecaoId]);
    //this.router.navigate(['/inspecao_recebimento', JSON.stringify(ids)]);
  }

  closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  listInspecaoFiltroString() {
    if (this.filtroAll == '' || this.filtroAll == null) {
      this.ListInspecao();
    } else {
      this.loading = false;
      this.inspecaoService
        .findAllString(
          this.page,
          this.qtdPorPagina,
          'id',
          'DESC',
          this.filtroAll
        )
        .subscribe(
          (responseApi: InspecaoDTO[]) => {
            this.inspecoes = responseApi['content'];
            this.page = responseApi['number'];
            this.totalPages = responseApi['totalPages'];
            this.whatList = 2;
            this.loading = true;
          },
          (error) => {}
        );
    }
  }

  buscarInspecao(id, modal) {
    this.inspecaoService.findById(id).subscribe(
      (inspecao: InspecaoDTO) => {
        this.inspecao = inspecao;
        this.notaFiscal = this.inspecao.notaFiscal;
        if (modal) {
          this.openBtn.nativeElement.click();
        }
      },
      (error) => {}
    );
  }

  buscarStatus(id) {
    this.buscarInspecao(id, false);
    this.inspecaoService.findByStatus().subscribe(
      (status: ChaveValor) => {
        this.statusInspecao = status;
        this.openBtnStatus.nativeElement.click();
      },
      (error) => {}
    );
  }

  alterarStatus() {
    console.log('inspecao', this.inspecao);
    this.inspecaoService.updateStatus(this.inspecao.id, this.statusSelecionado).subscribe(
      (retorno) => {
        this.getFiltros();
        this.closeBtnStatus.nativeElement.click();
      },
      (error) => {}
    );
  }
}
