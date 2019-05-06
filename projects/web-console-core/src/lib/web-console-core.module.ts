import { ServiceLocator } from './service.locator';
import { Injector } from '@angular/core';
import { WCTopBarContentDirective } from './components/top-bar/wc-top-bar-content-directive';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { WebConsoleComponent } from './components/web-console/web-console.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService, AuthGuard } from './services/auth-service/auth.service';
import { WebConsoleConfig } from './config/WebConsoleConfig';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'
//import { ACLPermissionDirective } from './services/acl-service/acl-directive'
import { StatusBarComponent, StatusBarDirective, StatusBarService, MainStatusBarItemComponent, MainStatusBarProgressComponent } from './components/status-bar/index'
import { MotifActivityIndicatorService } from './services/motif-connector/motif-activity-indicator.service'
import { WCMainMenuComponent } from './components/main-menu/main-menu.component'
import { MotifPagedQueryInterceptor } from './services/motif-connector/motif-paged-query-interceptor'
import { WCTopBarService } from './components/top-bar/wc-top-bar-service';
import { WCTopBarComponent } from './components/top-bar/wc-top-bar-component';
import { WCTopBarItem } from './components/top-bar/wc-top-bar-item';
import { NGXLogger } from 'ngx-logger';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TooltipModule } from 'ng2-tooltip-directive';
import { EventBusService } from './services/event-bus/event-bus-service';
import { WebConsolePluginManagerService } from './services/web-console-plugin-manager/web-console-plugin-manager.service';


@NgModule({
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MotifActivityIndicatorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MotifPagedQueryInterceptor, multi: true },
    AuthGuard,
    StatusBarService,
    WCTopBarService,
    AuthService,
    EventBusService,
    WebConsolePluginManagerService
  ],
  declarations: [
    WebConsoleComponent,
    PageNotFoundComponent,
    /*ACLPermissionDirective,*/
    WCTopBarContentDirective,
    StatusBarComponent,
    StatusBarDirective,
    MainStatusBarItemComponent,
    MainStatusBarProgressComponent,
    WCMainMenuComponent,
    WCTopBarComponent
  ],
  imports:[
    CommonModule,
    HttpClientModule,
    NgScrollbarModule,
    TooltipModule,
    RouterModule.forChild([])
  ],
  entryComponents:[ MainStatusBarItemComponent, MainStatusBarProgressComponent ],
  exports: [
    WebConsoleComponent,
    RouterModule,
    /*ACLPermissionDirective,*/
    StatusBarComponent,
    StatusBarDirective
  ]
})
export class WebConsoleCoreModule {
  constructor(private logger:NGXLogger, private injector: Injector){
    ServiceLocator.injector = injector;
    this.logger.debug("WebCoreCoreModule created");
  }

  static withConfig(config:WebConsoleConfig): ModuleWithProviders {
    return {
      ngModule: WebConsoleCoreModule,
      providers: [
        {
          provide : WebConsoleConfig,
          useValue: config,
        }
      ]
    };
  }

}

