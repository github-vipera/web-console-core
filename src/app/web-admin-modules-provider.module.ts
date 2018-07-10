import { NgModule } from "@angular/core";
import { WebConsoleCoreModule } from 'web-console-core'

@NgModule({
    imports:[ WebConsoleCoreModule.withConfig({loginRoute:"login",dashboardRoute:"dashboard"})],
    exports:[ WebConsoleCoreModule]
})
export class WebAdminModulesProvider {

}