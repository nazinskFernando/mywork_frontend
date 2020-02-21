export class OrdemServicoDTO {
    constructor(
          public id: number,	
          public numeroOrdem: string,
          public descricaoOrdem: string,
          public tempoServico: string,
          public wbs: string,
          public numeroRelatorio: string    
           ){}
}
    