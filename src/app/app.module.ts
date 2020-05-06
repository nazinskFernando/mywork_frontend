
import { ClienteService } from './services/domain/cliente.service';
import { LaudoService } from './services/domain/laudo.service';
import { InspecaoService } from './services/domain/inspecao.service';

import { EquipamentoService } from './services/domain/equipamento.service';
import { DialogService } from './dialog.service';
import { AuthInterceptor } from './components/security/interceptors/auth.interceptor';
import { AuthGuard } from './components/security/auth.guard';
import { ErrorInterceptorProvider } from './components/security/interceptors/error-interceptor';
import { StorageService } from './services/storage.service';
import { SharedService } from './services/shared.service';
import { UserService } from './services/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/security/login/login.component';
import { routes } from './app.routes';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './components/security/user-list/user-list.component';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { InspecaoListComponent } from './components/qualidade/inspecao-list/inspecao-list.component';
import { GerarInspecaoComponent } from './components/qualidade/gerar-inspecao/gerar-inspecao.component';
import { MyAlertComponent } from './components/qualidade/my-alert/my-alert.component';
import { InspecaoRecebimentoComponent } from './components/qualidade/inspecao-recebimento/inspecao-recebimento.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { NewNotaFiscalComponent } from './components/qualidade/new-nota-fiscal/new-nota-fiscal.component';
import { ListNotaFiscalComponent } from './components/qualidade/list-nota-fiscal/list-nota-fiscal.component';
import { NotaFiscalService } from './services/domain/nota-fiscal.service';
import { EmailComponent } from './components/email/email.component';
import { EmailService } from './services/domain/email.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    UserListComponent,
    FormDebugComponent,
    LoadingSpinnerComponent,
    InspecaoListComponent,
    GerarInspecaoComponent,
    MyAlertComponent,
    InspecaoRecebimentoComponent,
    FileSelectDirective, NewNotaFiscalComponent, ListNotaFiscalComponent, EmailComponent  
  ],
  imports: [
    BrowserModule,
    routes,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    UserService,
    SharedService,
    StorageService,
    ErrorInterceptorProvider,
    AuthGuard,
    DialogService,
    EquipamentoService,
    NotaFiscalService,
    InspecaoService,
    LaudoService,
    ClienteService,
    EmailService,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi: true
    },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
