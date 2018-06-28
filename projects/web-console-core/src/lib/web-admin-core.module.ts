import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { WebAdminConsoleComponent } from './components/web-admin-console/web-admin-console.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService, AuthGuard } from './services/auth-service/auth.service';
import { WebConsoleConfig } from './config/WebConsoleConfig';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'



@NgModule({
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true },
    AuthGuard
  ],
  declarations: [
    WebAdminConsoleComponent, PageNotFoundComponent
  ],
  imports:[
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([])
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

  static withConfig(config:WebConsoleConfig): ModuleWithProviders {
    return {
      ngModule: WebAdminCoreModule,
      providers: [
        {
          provide :WebConsoleConfig,
          useValue: config,
        }
      ]
    };
  }

}

