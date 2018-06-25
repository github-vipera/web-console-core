import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router'
import { CommonModule } from '@angular/common';
import {WebAdminConsoleComponent} from './components/web-admin-console/web-admin-console.component'
@NgModule({
  declarations: [
    WebAdminConsoleComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forRoot([],{ enableTracing: true })
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
