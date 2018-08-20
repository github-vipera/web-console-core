import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { WebConsoleComponent } from './components/web-console/web-console.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService, AuthGuard } from './services/auth-service/auth.service';
import { WebConsoleConfig } from './config/WebConsoleConfig';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'
import { ACLPermissionDirective } from './services/acl-service/acl-directive'
import { StatusBarComponent, StatusBarDirective, StatusBarService, MainStatusBarItemComponent, MainStatusBarProgressComponent } from './components/status-bar/index'
import { MotifActivityIndicatorService } from './services/motif-connector/motif-activity-indicator.service'
import { WCMainMenuComponent } from './components/main-menu/main-menu.component'

@NgModule({
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MotifActivityIndicatorService, multi: true },
    AuthGuard,
    StatusBarService
  ],
  declarations: [
    WebConsoleComponent, 
    PageNotFoundComponent, 
    ACLPermissionDirective, 
    StatusBarComponent, 
    StatusBarDirective, 
    MainStatusBarItemComponent, 
    MainStatusBarProgressComponent,
    WCMainMenuComponent
  ],
  imports:[
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([])
  ],
  entryComponents:[ MainStatusBarItemComponent, MainStatusBarProgressComponent ],
  exports: [
    WebConsoleComponent,
    RouterModule,
    ACLPermissionDirective,
    StatusBarComponent, 
    StatusBarDirective
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

