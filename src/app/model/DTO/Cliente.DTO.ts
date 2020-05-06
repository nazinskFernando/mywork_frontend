import { EmailDTO } from "./Email.DTO";

export class ClienteDTO {   
        public id: string;
        public nome: string;
        public imagem: string;
        public emailsClientes = new Array<EmailDTO>();   
}
