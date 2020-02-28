import { ClienteDTO } from "./Cliente.DTO";

export class EquipamentoDTO {
    constructor(
        public id: string,
        public partNumber: string,
        public serialNumber: string,
        public descricao: string,
        public cliente: ClienteDTO,
        public isInspecionado: boolean
        ){}
}
