import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
var WebAdminRoutingModule = (function () {
    function WebAdminRoutingModule() {
        console.log("WebAdminRoutingModule created");
    }
    WebAdminRoutingModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        RouterModule.forRoot([], { enableTracing: true })
                    ],
                    exports: [
                        RouterModule
                    ]
                },] },
    ];
    /** @nocollapse */
    WebAdminRoutingModule.ctorParameters = function () { return []; };
    return WebAdminRoutingModule;
}());
export { WebAdminRoutingModule };
//# sourceMappingURL=web-admin-routing.modules.js.map