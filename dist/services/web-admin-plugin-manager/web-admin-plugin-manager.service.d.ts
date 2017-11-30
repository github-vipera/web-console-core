import { Route } from '@angular/router';
export declare class WebAdminPluginManagerService {
    private pluginCatalog;
    constructor();
    createRouteConfigFromCatalog(): Promise<Array<Route>>;
    private fetchCatalog();
}
