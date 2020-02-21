import { LaudoDTO } from './Laudo.DTO';
import { NotaFiscalDTO } from './NotaFiscal.DTO';
import { EquipamentoDTO } from './Equipamento.DTO';
export class InspecaoDTO {
    constructor(
        public id: string,
        public equipamentoDTO: EquipamentoDTO,
        public notaFiscalDTO: NotaFiscalDTO,
        public dataInspecao: Date,
        public laudos:LaudoDTO[]
        ){}
}
