
const DEFAULT_DASHBOARD_ROUTE:string ="dashboard";
export class WebConsoleConfig{
    loginRoute:string;
    dashboardRoute:string;
    constructor(loginRoute:string,dashboardRoute:string){
        this.loginRoute = loginRoute;
        this.dashboardRoute = dashboardRoute;
    }
    
    public static create(loginRoute:string, dashboardRoute : string){
        return new WebConsoleConfig(loginRoute,dashboardRoute || DEFAULT_DASHBOARD_ROUTE);
    }
}