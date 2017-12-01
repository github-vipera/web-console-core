import { Component } from '@angular/core';
import { WebAdminPluginManagerService } from '../../services';
import { Router } from '@angular/router';
var WebAdminConsoleComponent = (function () {
    function WebAdminConsoleComponent(pluginManager, router) {
        this.pluginManager = pluginManager;
        this.router = router;
        this.routes = [];
        console.log("console component constructor");
        this.errorBox = {
            show: false,
            message: null
        };
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
            _this.showError("Catalog mapping fail");
        }).catch(function (err) {
            console.error("Catch fail to crete routing:", err);
            _this.showError("Catalog mapping fail");
        });
    };
    WebAdminConsoleComponent.prototype.showError = function (message) {
        this.errorBox.message = message;
        this.errorBox.show = true;
    };
    WebAdminConsoleComponent.prototype.hideError = function () {
        this.errorBox.show = false;
        this.errorBox.message = null;
    };
    WebAdminConsoleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'web-admin-console',
                    styles: ["\n    a.plugin-link{padding:10px}.error-box{display:block;width:100%;text-align:center;background-color:red}.error-box p.error-msg{font-weight:bold;color:white;padding:10px}\n  "],
                    template: "\n    <div>\n        <div class=\"routing-container\" *ngIf=\"!errorBox.show\">\n            <a class=\"plugin-link\"   *ngFor=\"let route of routes\" routerLink=\"{{route.path}}\">{{route.path}}</a>\n        </div>\n        <div class=\"error-box\" *ngIf=\"errorBox.show\">\n            <p class=\"error-msg\">{{errorBox.message}}</p>\n        </div>\n    \n        <router-outlet></router-outlet>\n    </div>\n  ",
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