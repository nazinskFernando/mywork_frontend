import { LaudoDTO } from './Laudo.DTO';
import { NotaFiscalDTO } from './NotaFiscal.DTO';
import { EquipamentoDTO } from './Equipamento.DTO';
export class InspecaoDTO {
    constructor(        
        public id: string,
        public descricao: string,
        public partNumber: string,
        public numeroSerie: string,
        public laudos: LaudoDTO[],
        public equipamento: EquipamentoDTO,
        public notaFiscal: NotaFiscalDTO,
        ){}
}
