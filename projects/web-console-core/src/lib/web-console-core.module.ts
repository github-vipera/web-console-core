import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { WebConsoleComponent } from './components/web-console/web-console.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService, AuthGuard } from './services/auth-service/auth.service';
import { WebConsoleConfig } from './config/WebConsoleConfig';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'
import { StatusBarComponent } from './components/status-bar/status-bar.component'
import { StatusBarDirective } from './components/status-bar/status-bar.directive'
import { ACLPermissionDirective } from './services/acl-service/acl-directive'

@NgModule({
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true },
    AuthGuard
  ],
  declarations: [
    WebConsoleComponent, PageNotFoundComponent, StatusBarComponent, StatusBarDirective, ACLPermissionDirective
  ],
  imports:[
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([])
  ],
  exports: [
    WebConsoleComponent,
    RouterModule,
    ACLPermissionDirective
  ]
})
export class WebConsoleCoreModule {
  constructor(){
    console.log("WebCoreCoreModule created");
  }

  static withConfig(config:WebConsoleConfig): ModuleWithProviders {
    return {
      ngModule: WebConsoleCoreModule,
      providers: [
        {
          provide :WebConsoleConfig,
          useValue: config,
        }
      ]
    };
  }

}

