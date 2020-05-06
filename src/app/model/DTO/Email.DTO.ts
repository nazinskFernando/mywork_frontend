import { ClienteDTO } from './Cliente.DTO';
export class EmailDTO {   
        public id: string;
        public email: string;   
        public cliente? = new ClienteDTO(); 
}
