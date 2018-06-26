import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router'
import { CommonModule } from '@angular/common';
import {WebAdminConsoleComponent} from './components/web-admin-console/web-admin-console.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth-service/auth.service';
@NgModule({
  providers:[
    //{ provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true },
  ],
  declarations: [
    WebAdminConsoleComponent
  ],
  imports:[
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot([],{enableTracing:true})
  ],
  exports: [
    WebAdminConsoleComponent,
    RouterModule
  ]
})
export class WebAdminCoreModule {
  constructor(){
    console.log("WebAdminCoreModule created");
  }
}
