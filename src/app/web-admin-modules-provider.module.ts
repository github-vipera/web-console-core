import { NgModule } from "@angular/core";
import { WebAdminCoreModule } from 'web-console-core'

@NgModule({
    imports:[ WebAdminCoreModule.withConfig({loginRoute:"login",dashboardRoute:"dashboard"})],
    exports:[ WebAdminCoreModule]
})
export class WebAdminModulesProvider {

}