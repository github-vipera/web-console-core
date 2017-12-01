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
    /**
     * Implements onInit event handler.
     */
    ngOnInit(): void;
    private showError(message);
    private hideError();
}
