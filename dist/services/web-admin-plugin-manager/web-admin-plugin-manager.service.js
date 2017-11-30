import { Injectable } from '@angular/core';
import { PluginRegistry } from '../../index';
var WebAdminPluginManagerService = (function () {
    function WebAdminPluginManagerService() {
        console.log("WebAdminPluginManagerService injected");
    }
    WebAdminPluginManagerService.prototype.createRouteConfigFromCatalog = function () {
        //TODO fetch plugin from server and merge data with this config
        return PluginRegistry.getInstance().getRouteConfig();
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