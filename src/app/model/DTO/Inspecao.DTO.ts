import { User } from './../user.model';
import { LaudoDTO } from './Laudo.DTO';
import { NotaFiscalDTO } from './NotaFiscal.DTO';
import { EquipamentoDTO } from './Equipamento.DTO';
export class InspecaoDTO {
    constructor(        
        public id: string,
        public numeroRelatorio: string,
        public equipamento: EquipamentoDTO,
        public notaFiscal: NotaFiscalDTO,
        public dataInspecao: string,
        public statusInspecao: string,
        public usuario: User,
        public laudos: LaudoDTO[],
        ){}
}
