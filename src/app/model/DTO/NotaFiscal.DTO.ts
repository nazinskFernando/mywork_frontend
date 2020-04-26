import { EquipamentoDTO } from './Equipamento.DTO';
export class NotaFiscalDTO {
    
       public id : string;
       public numeroNotaFiscal : string;
       public origem : string;
       public rt : string;
       public dataEntrada : string;
       public emissor : string;
       public setorDestino : string;
       public transportadora : string;
       public chaveNf : string;
       public contrato : string;
       public observacao : string;
       public portadorEntraraComCarro : string;
       public statusNotaFiscal : string;
       public nfRecusadaPelaLogistica : string;
       public necessarioIntervencaoLogistica : string;
       public equipamentos = new Array<EquipamentoDTO>();
       public numeroOrdem : string;
       public descricaoOrdem : string;
       public tempoServico : string;
       public wbs : string;
       public numeroRelatorio : string;
      
}