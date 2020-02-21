import { EquipamentoDTO } from './Equipamento.DTO';
import { NotaFiscalDTO } from './NotaFiscal.DTO';
export class EquipamentoNotaFiscalDTO
 {
    constructor(
       public notaFiscal : NotaFiscalDTO,
       public equipamento: EquipamentoDTO
        ){}
}