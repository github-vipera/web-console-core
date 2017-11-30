var _ = require('lodash');
var instance = undefined;
var PluginRegistry = (function () {
    function PluginRegistry() {
        this.pluginMap = {};
        console.log("Create component registry");
    }
    PluginRegistry.getInstance = function () {
        if (instance == null) {
            instance = new PluginRegistry();
        }
        return instance;
    };
    PluginRegistry.prototype.createRegistrationEntry = function (name, value, route) {
        return {
            name: name,
            component: value,
            routeDef: route
        };
    };
    PluginRegistry.prototype.registryPluginComponent = function (name, value, route) {
        console.log("registryPluginComponent", value);
        var entry = this.createRegistrationEntry(name, value, route);
        this.pluginMap[name] = entry;
    };
    PluginRegistry.prototype.getRouteConfig = function () {
        var info = [];
        _.forEach(this.pluginMap, function (entry, key) {
            if (entry.routeDef) {
                info.push(entry.routeDef);
            }
            else {
                info.push({
                    path: key,
                    component: entry.component
                });
            }
        });
        return info;
    };
    return PluginRegistry;
}());
export { PluginRegistry };
/**
 * Decorator for plugin registration
 * @param name plugin name; if route is null, this name are used as path
 * @param route
 */
export function PluginView(name, route) {
    console.log("pluginview decorator called", name);
    return function (target) {
        PluginRegistry.getInstance().registryPluginComponent(name, target, route);
    };
}
//# sourceMappingURL=PluginRegistry.js.map