import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ExtComponent} from './extensions/ext.component'
import { WebAdminModulesProvider } from './web-admin-modules-provider.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, WebAdminConsoleComponent, PageNotFoundComponent } from 'web-console-core'

const routes:Routes = [
  {
    path:"dashboard",
    component:WebAdminConsoleComponent,
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
    ExtComponent
  ],
  imports: [
    BrowserModule , WebAdminModulesProvider,
    RouterModule.forRoot(routes,{enableTracing:true})
  ],
  providers: [WebAdminModulesProvider],
  entryComponents: [ExtComponent],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
