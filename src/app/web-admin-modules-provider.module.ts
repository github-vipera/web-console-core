import { NgModule } from "@angular/core";
import { WebAdminCoreModule } from 'web-console-core'

@NgModule({
    imports:[ WebAdminCoreModule.withConfig({loginRoute:"login"})],
    exports:[ WebAdminCoreModule ]
})
export class WebAdminModulesProvider {

}