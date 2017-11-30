import { Injectable } from '@angular/core';
import { PluginRegistry } from '../../index';
var WebAdminPluginManagerService = (function () {
    function WebAdminPluginManagerService() {
        console.log("WebAdminPluginManagerService injected");
    }
    WebAdminPluginManagerService.prototype.createRouteConfigFromCatalog = function () {
        //TODO fetch plugin from server and merge data with this config
        return new Promise(function (resolve) {
            fetch('/rest/registry/plugin/list?all=true').then(function (response) {
                return response.json();
            }).then(function (json) {
                var plugins = json.Plugin;
                resolve(PluginRegistry.getInstance().getRouteConfig(plugins));
            }).catch(function (err) {
                console.error("Error in fetch", err);
            });
        });
        //return null;
    };
    WebAdminPluginManagerService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    WebAdminPluginManagerService.ctorParameters = function () { return []; };
    return WebAdminPluginManagerService;
}());
export { WebAdminPluginManagerService };
/*export interface PluginInfo{
    getPluginId():string
    getPluginDescription():string
}*/
//# sourceMappingURL=web-admin-plugin-manager.service.js.map