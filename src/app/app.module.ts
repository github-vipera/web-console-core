import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ExtComponent} from './extensions/ext.component'
import { WebAdminModulesProvider } from './web-admin-modules-provider.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, WebConsoleComponent, PageNotFoundComponent } from 'web-console-core'
import { LoginComponent } from './login/login/login.component';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'
import { WC_API_BASE_PATH, WC_OAUTH_BASE_PATH } from 'web-console-core'
import { environment } from '../environments/environment';
import { ExtComponentB } from './extensions/ext.component.1'

const routes:Routes = [
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"dashboard",
    component:WebConsoleComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"**",
    component:PageNotFoundComponent
    }
]

@NgModule({
  declarations: [
    AppComponent,
    ExtComponent,
    ExtComponentB,
    LoginComponent
  ],
  imports: [
    BrowserModule , WebAdminModulesProvider,
    RouterModule.forRoot(routes,{enableTracing:true}),
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF})
  ],
  providers: [
    { provide: WC_API_BASE_PATH, useValue: environment.API_BASE_PATH },
    { provide: WC_OAUTH_BASE_PATH, useValue: environment.OAUTH_BAS_PATH },
    WebAdminModulesProvider],
  entryComponents: [ExtComponent, ExtComponentB],
  bootstrap: [AppComponent]
})
export class AppModule {
}
