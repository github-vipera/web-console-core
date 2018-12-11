import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ExtComponent} from './extensions/ext.component'
import { WebAdminModulesProvider } from './web-admin-modules-provider.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, WebConsoleComponent, PageNotFoundComponent } from 'web-console-core'
import { LoginComponent } from './login/login/login.component';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'

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
    LoginComponent
  ],
  imports: [
    BrowserModule , WebAdminModulesProvider,
    RouterModule.forRoot(routes,{enableTracing:true}),
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF})
  ],
  providers: [WebAdminModulesProvider],
  entryComponents: [ExtComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
