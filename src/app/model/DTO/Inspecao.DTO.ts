import { AcessorioComponenteDTO } from './AcessoriosComponentes.DTO';
import { LingadaDTO } from './Lingada.DTO';
import { OrdemServicoDTO } from './OrdemServico.DTO';
import { User } from './../user.model';
import { LaudoDTO } from './Laudo.DTO';
import { NotaFiscalDTO } from './NotaFiscal.DTO';
import { EquipamentoDTO } from './Equipamento.DTO';
export class InspecaoDTO {
          
        public id: string;
        public equipamento = new EquipamentoDTO();
        public notaFiscal = new NotaFiscalDTO();
        public dataInspecao: string;
        public statusInspecao: string;
        public usuario?: User;
        public laudos = new Array<LaudoDTO>();
        public ordemServico = new OrdemServicoDTO();
        public lingadas = new Array<LingadaDTO>();
        public acessoriosComponentes = new Array<AcessorioComponenteDTO>();
       
}
