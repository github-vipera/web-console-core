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
                    styles: ["\n    .web-console-container{height:100%;margin:0;padding:0;font-family:'Open Sans', sans-serif;display:flex;background:#282D31;flex-wrap:wrap;box-sizing:border-box;outline:none;color:#ddd}.web-console-container *{transition:.1s}\n  "],
                    template: "\n    <div class=\"web-console-container\">\n        <header>\n            <div class=\"description\">Vipera Motif Admin Console \u2022 mw_uat_1 \u2022 52.28.189.225</div>\n            <div class=\"logo\"><img src=\"assets/img/logo.svg\"></div>\n            <div class=\"cmd\"><a href=\"index.htm\" class=\"btn\">Logout</a></div>\n        </header>\n        <nav class=\"routing-container\" *ngIf=\"!errorBox.show\">\n            <a class=\"plugin-link\" *ngFor=\"let route of routes\" routerLink=\"{{route.path}}\">\n               <svg><use xlink:href=\"assets/img/icons.svg#ico-plugins\"></use></svg>\n               <span>{{route.path}}</span>\n            </a>\n        </nav>\n        <main class=\"web-console-page-container\">\n            <!--<div class=\"error-box\" *ngIf=\"errorBox.show\">\n                <p class=\"error-msg\">{{errorBox.message}}</p>\n            </div>-->\n            <section class=\"contents\">\n                <router-outlet></router-outlet>        \n            </section>\n        </main>\n        <footer>\n                <div class=\"settings\">\n                    <div class=\"switch\">\n                        <input type=\"checkbox\" id=\"light-theme\"><label for=\"light-theme\" id=\"theme\"></label>\n                    </div>\n                    <div class=\"size\">\n                        <input type=\"radio\" name=\"font-size\" id=\"fsize1\" value=\"xsmall\" onclick=\"changeSize(this);\"><label for=\"fsize1\"></label>\n                        <input type=\"radio\" name=\"font-size\" id=\"fsize2\" value=\"small\" onclick=\"changeSize(this);\"><label for=\"fsize2\"></label>\n                        <input type=\"radio\" name=\"font-size\" id=\"fsize3\" value=\"normal\" onclick=\"changeSize(this);\" checked><label for=\"fsize3\"></label>\n                        <input type=\"radio\" name=\"font-size\" id=\"fsize4\" value=\"large\" onclick=\"changeSize(this);\"><label for=\"fsize4\"></label>\n                        <input type=\"radio\" name=\"font-size\" id=\"fsize5\" value=\"xlarge\" onclick=\"changeSize(this);\"><label for=\"fsize5\"></label>\n                    </div>\n                </div>\n                <div class=\"license\">ViperaOSGI \u2022 ver. 1.10 \u2022 Issued 02.25.2016 \u2022 <b class=\"warn\">Expires 12.31.2018</b></div>\n        </footer>\n    </div>\n  "
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