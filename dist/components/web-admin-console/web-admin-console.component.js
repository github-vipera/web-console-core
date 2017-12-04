import { Component } from '@angular/core';
import { WebAdminPluginManagerService } from '../../services';
import { Router } from '@angular/router';
var WebAdminConsoleComponent = (function () {
    function WebAdminConsoleComponent(pluginManager, router) {
        this.pluginManager = pluginManager;
        this.router = router;
        this.routes = [];
        console.log("console component constructor");
        this.initErrorBox();
    }
    WebAdminConsoleComponent.prototype.initErrorBox = function () {
        this.errorBox = {
            show: false,
            message: null
        };
    };
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
        console.log("WebAdminConsoleComponent init done");
        this.initStaticRouting();
        this.createRoutingConfigByMotifCatalog();
    };
    WebAdminConsoleComponent.prototype.createRoutingConfigByMotifCatalog = function () {
        var _this = this;
        this.pluginManager.createRouteConfigFromCatalog().then(function (result) {
            _this.routes = result;
            _this.router.resetConfig(_this.routes);
            console.log("WebAdminConsoleComponent routes", _this.routes);
            _this.validateCurrentRoute();
        }, function (err) {
            console.error("Fail to crete routing:", err);
            _this.resetRouting([]);
            _this.showError("Catalog mapping fail");
            _this.validateCurrentRoute();
        }).catch(function (err) {
            console.error("Catch fail to crete routing:", err);
            _this.resetRouting([]);
            _this.showError("Catalog mapping fail");
            _this.validateCurrentRoute();
        });
    };
    WebAdminConsoleComponent.prototype.initStaticRouting = function () {
        console.log("initStaticRouting");
        this.resetRouting(this.pluginManager.getInitialConfig());
    };
    WebAdminConsoleComponent.prototype.validateCurrentRoute = function () {
        var _this = this;
        var url = this.router.routerState.snapshot.url;
        console.log("active", "" + this.router.isActive(url, true));
        if (url) {
            this.router.navigateByUrl(url).then(function (res) {
                console.log("navigateByUrl:", res);
            }, function (err) {
                console.error("navigateByUrl err", err);
                _this.router.navigateByUrl('/');
            });
        }
    };
    /**
     * Reset routing config
     * @param routes
     */
    /**
       * Reset routing config
       * @param routes
       */
    WebAdminConsoleComponent.prototype.resetRouting = /**
       * Reset routing config
       * @param routes
       */
    function (routes) {
        this.router.resetConfig(routes);
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
                    styles: ["\n    .web-console-container{position:fixed;width:100%;height:100%;top:0;left:0;display:flex;background-color:#394b59;color:#fff}.web-console-container .routing-container{flex:1;min-width:200px;max-width:200px;-webkit-box-shadow:3px 0 5px -1px rgba(0,0,0,0.2),6px 0 10px 0 rgba(0,0,0,0.14),1px 0 18px 0 rgba(0,0,0,0.12);-moz-box-shadow:3px 0 5px -1px rgba(0,0,0,0.2),6px 0 10px 0 rgba(0,0,0,0.14),1px 0 18px 0 rgba(0,0,0,0.12);box-shadow:3px 0 5px -1px rgba(0,0,0,0.2),6px 0 10px 0 rgba(0,0,0,0.14),1px 0 18px 0 rgba(0,0,0,0.12)}.web-console-container .routing-container a{color:#fff}.web-console-container .routing-container a.plugin-link{display:block;text-decoration:none;padding:10px}.web-console-container .routing-container a.plugin-link:hover{background-color:#8c9496}.web-console-container .routing-container h2{padding-left:10px;padding-bottom:15px;border-bottom:1px solid}.web-console-container .web-console-page-container{flex:3;padding:15px}.web-console-container .web-console-page-container div.error-box{display:block;width:100%;text-align:center;background-color:red}.web-console-container .web-console-page-container div.error-box p.error-msg{font-weight:bold;color:white;padding:10px}\n  "],
                    template: "\n    <div class=\"web-console-container\">\n        <div class=\"routing-container\" *ngIf=\"!errorBox.show\">\n            <h2>Plugins</h2>\n            <a class=\"plugin-link\"   *ngFor=\"let route of routes\" routerLink=\"{{route.path}}\">{{route.path}}</a>\n        </div>\n        <div class=\"web-console-page-container\">\n            <div class=\"error-box\" *ngIf=\"errorBox.show\">\n                <p class=\"error-msg\">{{errorBox.message}}</p>\n            </div>\n            <router-outlet></router-outlet>\n        </div>\n    </div>\n  ",
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