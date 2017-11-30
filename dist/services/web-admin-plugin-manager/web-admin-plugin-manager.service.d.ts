import { Route } from '@angular/router';
export declare class WebAdminPluginManagerService {
    private pluginCatalog;
    constructor();
    createRouteConfigFromCatalog(): Array<Route>;
}
export interface PluginInfo {
    getPluginId(): string;
    getPluginDescription(): string;
}
