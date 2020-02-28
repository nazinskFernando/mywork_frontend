import { DescricaoLaudoDTO } from "./DescricaoLaudo.DTO";

export class LaudoDTO {
    constructor(
        public id: string,
        public imagem: string,
        public usarRelatorio: boolean,
        public comDesvio: boolean,
        public descricaoLaudo: DescricaoLaudoDTO
        ){}
}

