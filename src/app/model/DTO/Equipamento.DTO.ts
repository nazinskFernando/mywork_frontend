import { ClienteDTO } from "./Cliente.DTO";

export class EquipamentoDTO {
    
    public id: string;
    public partNumber: string;
    public serialNumber: string;
    public descricao: string;
    public cliente = new ClienteDTO();
    public contratoJuridico: string;
    public contSap: string;
    public tag: string;  
    public tipoSalvamento?: string; 
    public codEquipamento: string;    
}
