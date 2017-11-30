import { Injectable } from '@angular/core';
import { PluginRegistry } from '../../index';
var WebAdminPluginManagerService = (function () {
    function WebAdminPluginManagerService() {
        console.log("WebAdminPluginManagerService injected");
    }
    WebAdminPluginManagerService.prototype.createRouteConfigFromCatalog = function () {
        var _this = this;
        /*return new Promise<Array<Route>>((resolve) => {
                    fetch('/rest/registry/plugin/list?all=true').then((response:any) => {
                        return response.json();
                    }).then((json:any) => {
                        let plugins:Array<PluginInfo> = json.Plugin;
                        resolve(PluginRegistry.getInstance().getRouteConfig(plugins));
                    }).catch((err) => {
                        console.error("Error in fetch",err);
                    });
                });*/
        return new Promise(function (resolve, reject) {
            _this.fetchCatalog().then(function (catalog) {
                resolve(PluginRegistry.getInstance().getRouteConfig(catalog));
            }, reject);
        });
    };
    WebAdminPluginManagerService.prototype.fetchCatalog = function () {
        return new Promise(function (resolve) {
            fetch('/rest/registry/plugin/list?all=true').then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            }).then(function (json) {
                var plugins = json.Plugin;
                resolve(json.Plugin);
            });
        });
    };
    WebAdminPluginManagerService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    WebAdminPluginManagerService.ctorParameters = function () { return []; };
    return WebAdminPluginManagerService;
}());
export { WebAdminPluginManagerService };
//# sourceMappingURL=web-admin-plugin-manager.service.js.map