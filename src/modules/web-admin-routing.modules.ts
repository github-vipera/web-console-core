import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([/*{path:'pluginDemo',component:WebAdminCoreComponent}*/],{ enableTracing: true })
  ],
  exports: [
    RouterModule
  ]
})
export class WebAdminRoutingModule { 
  constructor(){
    console.log("WebAdminRoutingModule created");
  }
}