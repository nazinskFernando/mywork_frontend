import { ClienteDTO } from './Cliente.DTO';
import { EmailDTO } from "./Email.DTO";
import { FiltroAuxDTO } from './FiltroAux.DTO';

export class FiltroNotaFiscalDTO {   
     
        public transportadoras = new Array<FiltroAuxDTO>();
        public setorDestinos = new Array<FiltroAuxDTO>();      
        public clientes = new Array<ClienteDTO>();  
}
