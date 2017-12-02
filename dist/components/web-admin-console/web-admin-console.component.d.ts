import { OnInit } from '@angular/core';
import { WebAdminPluginManagerService } from '../../services';
import { Route, Router } from '@angular/router';
export declare class WebAdminConsoleComponent implements OnInit {
    private pluginManager;
    private router;
    routes: Array<Route>;
    errorBox: {
        show: boolean;
        message: string;
    };
    constructor(pluginManager: WebAdminPluginManagerService, router: Router);
    private initErrorBox();
    /**
     * Implements onInit event handler.
     */
    ngOnInit(): void;
    private createRoutingConfigByMotifCatalog();
    private initStaticRouting();
    private validateCurrentRoute();
    /**
     * Reset routing config
     * @param routes
     */
    private resetRouting(routes);
    private showError(message);
    private hideError();
}
