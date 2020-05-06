export class Usuario {
   
        public id: string;
        public nome: string;
        public email: string;
        public cpfOuCnpj: string;
        public tipo: string;
        public senha: string;
        public perfis? = new Array<string>();
}