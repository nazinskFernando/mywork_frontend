import { NgForm } from "@angular/forms";
import { ResponseApi } from "../../../model/response-api";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";
import { SharedService } from "../../../services/shared.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Usuario } from "../../../model/DTO/Usuario.DTO";
import { DialogService } from "../../../dialog.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
})
export class UserListComponent implements OnInit {
  @ViewChild("form")
  form: NgForm;
  @ViewChild("closeBtn") closeBtn: ElementRef;
  @ViewChild("closeBtn2") closeBtn2: ElementRef;

  page: number = 0;
  count: number = 2;
  pages: Array<number>;
  shared: SharedService;
  message: { type: string; text: string };
  classCss: {};
  usuarios = new Array<Usuario>();
  usuario = new Usuario();
  showSpinner: boolean = true;

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private router: Router
  ) {
    this.shared = SharedService.getInstance();
  }

  ngOnInit() {
    this.findAll(0, 2);
  }

  closeModal(): void {
    
    this.usuario = new Usuario();
    this.closeBtn.nativeElement.click();
    this.closeBtn2.nativeElement.click();
  }

  findAll(page: number, count: number) {
    this.userService.findAll(page, count).subscribe(
      (responseApi: ResponseApi) => {
        this.usuarios = responseApi["content"];
        this.pages = new Array(responseApi["totalPages"]);
      },
      (error) => {}
    );
  }

  delete(id: string) {
    this.dialogService
      .confirm("Deseja realmente excluir?")
      .then((candelete: boolean) => {
        if (candelete) {
          this.userService.delete(id).subscribe((responseApi: ResponseApi) => {
            this.showMessage({
              type: "danger",
              text: "Registro apagado com sucesso!",
            });
            this.findAll(this.page, this.count);
          }),
            (err) => {};
        }
      });
  }

  setNextPage(event: any) {
    event.preventDefault();
    if (this.page < this.pages.length - 1) {
      this.page = this.page + 1;
      this.findAll(this.page, this.count);
    }
  }

  setPreviousPage(event: any) {
    event.preventDefault();
    if (this.page > 0) {
      this.page = this.page - 1;
      this.findAll(this.page, this.count);
    }
  }

  setPage(i, event: any) {
    event.preventDefault();
    this.page = i;
    this.findAll(this.page, this.count);
  }

  findById(id: string) {
    this.userService.findById(id).subscribe(
      (responseApi: Usuario) => {
        this.usuario = responseApi;
        console.log("Tipo", this.usuario);
      },
      (err) => {}
    );
  }

  register() {
    this.message = null;
    console.log("newUsuario", this.usuario);
    this.userService.createOrUpdate(this.usuario).subscribe(
      (response: ResponseApi) => {
        this.form.resetForm();
        // this.router.navigate(['user-list/']);
        this.showMessage({
          type: "success",
          text: "Registro criado com sucesso!",
        });
        this.usuario = new Usuario();
      },
      (error) => {
        this.showMessage({
          type: "error",
          text: error["error"]["errors"][0],
        });
      }
    );
    this.closeModal();
  }

  getFormGroupClass(isInvalid: boolean, isDirty: boolean): {} {
    return {
      "form-group": true,
      "has-error": isInvalid && isDirty,
      "has-success": !isInvalid && isDirty,
    };
  }

  private showMessage(message: { type: string; text: string }): void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => {
      this.message = undefined;
    }, 3000);
  }

  private buildClasses(type: string): void {
    this.classCss = {
      alert: true,
    };
    this.classCss["alert-" + type] = true;
  }

  cancelFormulario() {
    this.message = null;
    this.usuario = new Usuario();
    window.location.href = "/user-new";
    window.location.reload();
  }
}
