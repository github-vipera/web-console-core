import { NgModule } from "@angular/core";
import { WebAdminCoreModule } from 'web-console-core'

@NgModule({
    imports:[ WebAdminCoreModule ],
    exports:[ WebAdminCoreModule ]
})
export class WebAdminModulesProvider {

}