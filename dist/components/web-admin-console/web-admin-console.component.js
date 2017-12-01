import { Component } from '@angular/core';
import { WebAdminPluginManagerService } from '../../services';
import { Router } from '@angular/router';
var WebAdminConsoleComponent = (function () {
    function WebAdminConsoleComponent(pluginManager, router) {
        this.pluginManager = pluginManager;
        this.router = router;
        this.routes = [];
    }
    /**
     * Implements onInit event handler.
     */
    /**
       * Implements onInit event handler.
       */
    WebAdminConsoleComponent.prototype.ngOnInit = /**
       * Implements onInit event handler.
       */
    function () {
        var _this = this;
        console.log("WebAdminConsoleComponent init done");
        //this.routes = this.pluginManager.createRouteConfigFromCatalog();
        this.pluginManager.createRouteConfigFromCatalog().then(function (result) {
            _this.routes = result;
            _this.router.resetConfig(_this.routes);
            console.log("WebAdminConsoleComponent routes", _this.routes);
        }, function (err) {
            console.error("Fail to crete routing:", err);
        }).catch(function (err) {
            console.error("Catch fail to crete routing:", err);
        });
        //console.log("WebAdminConsoleComponent routes",this.routes);
        //this.router.resetConfig(this.routes);
    };
    WebAdminConsoleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'web-admin-console',
                    styles: ["\n    a.plugin-link{padding:10px}\n  "],
                    template: "\n    <div>\n        <a class=\"plugin-link\"  *ngFor=\"let route of routes\" routerLink=\"{{route.path}}\">{{route.path}}</a>\n        <router-outlet></router-outlet>\n    </div>\n  ",
                },] },
    ];
    /** @nocollapse */
    WebAdminConsoleComponent.ctorParameters = function () { return [
        { type: WebAdminPluginManagerService, },
        { type: Router, },
    ]; };
    return WebAdminConsoleComponent;
}());
export { WebAdminConsoleComponent };
//# sourceMappingURL=web-admin-console.component.js.map