import { NgModule } from '@angular/core';
import { WebAdminConsoleComponent } from './components';
import { WebAdminPluginManagerService } from './services';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
var WebAdminCoreModule = (function () {
    function WebAdminCoreModule() {
    }
    WebAdminCoreModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        WebAdminPluginManagerService
                    ],
                    declarations: [
                        WebAdminConsoleComponent
                    ],
                    entryComponents: [
                        WebAdminConsoleComponent
                    ],
                    imports: [
                        CommonModule,
                        RouterModule.forRoot([], { enableTracing: true })
                    ],
                    exports: [
                        WebAdminConsoleComponent,
                        RouterModule
                    ]
                },] },
    ];
    /** @nocollapse */
    WebAdminCoreModule.ctorParameters = function () { return []; };
    return WebAdminCoreModule;
}());
export { WebAdminCoreModule };
//# sourceMappingURL=web-admin.module.js.map