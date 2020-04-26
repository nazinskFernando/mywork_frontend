import { ListNotaFiscalComponent } from './components/qualidade/list-nota-fiscal/list-nota-fiscal.component';
import { NewNotaFiscalComponent } from './components/qualidade/new-nota-fiscal/new-nota-fiscal.component';
import { InspecaoRecebimentoComponent } from './components/qualidade/inspecao-recebimento/inspecao-recebimento.component';
import { MyAlertComponent } from './components/qualidade/my-alert/my-alert.component';
import { GerarInspecaoComponent } from './components/qualidade/gerar-inspecao/gerar-inspecao.component';
import { InspecaoListComponent } from './components/qualidade/inspecao-list/inspecao-list.component';
import { UserListComponent } from './components/security/user-list/user-list.component';
import { UserNewComponent } from './components/security/user-new/user-new.component';
import { UserService } from './services/user.service';
import { AuthGuard } from './components/security/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/security/login/login.component';

import {Routes, RouterModule} from '@angular/router'
import { ModuleWithProviders } from '@angular/core';

export const ROUTES: Routes = [
    { path : '', component : HomeComponent, canActivate: [AuthGuard]},
    { path : 'login', component : LoginComponent},
    { path : 'user-new', component: UserNewComponent, canActivate: [AuthGuard]},
    { path : 'user-new/:id', component: UserNewComponent, canActivate: [AuthGuard]},
    { path : 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
    { path : 'inspecao-list', component: InspecaoListComponent, canActivate: [AuthGuard]},
    { path : 'gerar-inspecao', component: GerarInspecaoComponent, canActivate: [AuthGuard]},
    { path : 'my-alert', component: MyAlertComponent, canActivate: [AuthGuard]},
    { path : 'inspecao_recebimento/:id', component: InspecaoRecebimentoComponent, canActivate: [AuthGuard]},
    { path : 'new_nota_fiscal', component: NewNotaFiscalComponent, canActivate: [AuthGuard]},
    { path : 'new_nota_fiscal/:id', component: NewNotaFiscalComponent, canActivate: [AuthGuard]},
    { path : 'list_nota_fiscal', component: ListNotaFiscalComponent, canActivate: [AuthGuard]},
]

export const routes: ModuleWithProviders = RouterModule.forRoot(ROUTES);