import { ClienteDTO } from './Cliente.DTO';
import { FiltroAuxDTO } from './FiltroAux.DTO';

export class FiltroInspecaoDTO {

        public status = new Array<FiltroAuxDTO>();
        public inspetor = new Array<FiltroAuxDTO>();
        public clientes = new Array<ClienteDTO>();
}
