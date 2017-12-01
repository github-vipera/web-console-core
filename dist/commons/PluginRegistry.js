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
    PluginRegistry.prototype.createRegistrationEntry = function (name, value, info) {
        var registrationEntry = {
            name: name,
            component: value
        };
        if (info) {
            registrationEntry.routeDef = info.route;
            registrationEntry.dependencies = info.dependencies;
        }
        return registrationEntry;
    };
    PluginRegistry.prototype.registryPluginComponent = function (name, value, info) {
        console.log("registryPluginComponent", value);
        var entry = this.createRegistrationEntry(name, value, info);
        this.pluginMap[name] = entry;
    };
    PluginRegistry.prototype.getRouteConfig = function (plugins, checkDeps) {
        var _this = this;
        if (checkDeps === void 0) { checkDeps = true; }
        var info = [];
        _.forEach(this.pluginMap, function (entry, key) {
            if (checkDeps && !_this.checkDeps(entry, plugins)) {
                console.error("Plugin", entry.name, "removed");
            }
            else {
                if (entry.routeDef) {
                    info.push(entry.routeDef);
                }
                else {
                    info.push({
                        path: key,
                        component: entry.component
                    });
                }
            }
        });
        return info;
    };
    PluginRegistry.prototype.checkDeps = function (entry, plugins) {
        try {
            _.forEach(entry.dependencies || [], function (info) {
                if (_.findIndex(plugins || [], function (single) { return info.name == single.name; }) == -1) {
                    throw new Error("Plugin not found:" + info.name);
                }
            });
            return true;
        }
        catch (ex) {
            console.error("invalid plugin info", ex);
            return false;
        }
    };
    return PluginRegistry;
}());
export { PluginRegistry };
/**
 * Decorator for plugin registration
 * @param name plugin name; if route is null, this name are used as path
 * @param route
 */
export function PluginView(name, info) {
    console.log("pluginview decorator called", name);
    return function (target) {
        PluginRegistry.getInstance().registryPluginComponent(name, target, info);
    };
}
//# sourceMappingURL=PluginRegistry.js.map