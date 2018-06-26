import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ExtComponent} from './extensions/ext.component'
import { WebAdminModulesProvider } from './web-admin-modules-provider.module';

@NgModule({
  declarations: [
    AppComponent,
    ExtComponent
  ],
  imports: [
    BrowserModule , WebAdminModulesProvider
  ],
  providers: [WebAdminModulesProvider],
  entryComponents: [ExtComponent],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
