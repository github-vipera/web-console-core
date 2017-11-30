import { NgModule } from '@angular/core';
import { WebAdminConsoleComponent } from './components';
import { WebAdminPluginManagerService } from './services';
import {RouterModule} from '@angular/router'
import { CommonModule } from '@angular/common';
@NgModule({
  providers: [
    WebAdminPluginManagerService
  ],
  declarations: [
    WebAdminConsoleComponent
  ],
  entryComponents:[
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
}
