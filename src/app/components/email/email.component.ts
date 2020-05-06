import { EmailDTO } from './../../model/DTO/Email.DTO';
import { ClienteService } from './../../services/domain/cliente.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmailService } from '../../services/domain/email.service';
import { ClienteDTO } from '../../model/DTO/Cliente.DTO';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  @ViewChild("closeBtn") closeBtn: ElementRef;

  clientes = new Array<ClienteDTO>();
  email = new EmailDTO();
  emails = new Array<EmailDTO>();
  cliente = new ClienteDTO();

  constructor(
              private emailService: EmailService,
              private clienteService: ClienteService
    ) { }

  ngOnInit() {
    this.findAll();
  }

  closeModal(): void {
    this.findAll();
    this.closeBtn.nativeElement.click();
  }

  findAll() {
    this.clienteService.findAll().subscribe(
      (responseApi: ClienteDTO[]) => {
        this.clientes = responseApi; 
        console.log("Clientes", this.clientes);      
      },
      (error) => {}
    );
  }

  findByCliente() {
    this.clienteService.findById(this.cliente.id).subscribe(
      (responseApi: ClienteDTO) => {
        this.cliente = responseApi; 
        console.log("Clientes", this.clientes);      
      },
      (error) => {}
    );
  }

  delete(id: string) {
    this.emailService.delete(id).subscribe(
      (responseApi) => {  
        this.findAll();  
      },
      (error) => {}
    );
  }

  deleteComCliente(id: string) {
    this.emailService.delete(id).subscribe(
      (responseApi) => {  
        this.findByCliente();  
      },
      (error) => {}
    );
  }

  atribuirCliente(cliente: ClienteDTO){
    this.cliente = cliente;
  }

  inserir() {
    this.email.cliente.id = this.cliente.id;
    console.log('email', this.email);
    this.emailService.inserir(this.email).subscribe(
      (responseApi) => {   
        this.findByCliente();  
      },
      (error) => {}
    );
  }
}
