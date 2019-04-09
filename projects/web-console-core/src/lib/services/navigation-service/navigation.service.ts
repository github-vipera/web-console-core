import { NGXLogger } from 'ngx-logger';
import { Injectable } from "@angular/core";
import { Routes, Route, Router } from "@angular/router";
import { PluginInfo, PluginRegistry, PluginRegistrationEntry} from "../../commons/PluginRegistry";
import * as _ from 'lodash';
import { WebConsolePluginManagerService } from "../web-console-plugin-manager/web-console-plugin-manager.service";
import { WebConsoleConfig } from "../../config/WebConsoleConfig";

@Injectable({
    providedIn:'root'
})
export class NavigationService {
    constructor(private logger:NGXLogger, private pluginManager:WebConsolePluginManagerService,private router:Router, private config:WebConsoleConfig ){
        this.logger.debug("NavigationService");
        let routes = this.getInitialRouteConfig()
        //this.router.resetConfig(routes);
    }

    public goToDashboard(){
        this.router.navigate([this.config.dashboardRoute]);
    }


    public getInitialRouteConfig():Routes{
        let baseRoute:Route = this.findDashboardRoute(this.router.config);
        this.logger.debug("base route",baseRoute);
        let pluginRoutes:Routes = this.createIntialPluginsRoutes();
        this.patchCompleteRoutes(baseRoute,pluginRoutes);
        return this.router.config;;
    }

    private createIntialPluginsRoutes():Routes{
        let pluginList = PluginRegistry.getInstance().getAllPlugins();
        let result:Routes = [];
        _.forEach(pluginList,(entry:PluginRegistrationEntry) => {
            if(entry.routeDef){
                result.push(entry)
            }else{
                result.push({
                    path:entry.name,
                    component:entry.component
                });
            }
        });
        return result;
    }

    public async createRouteConfigFromCatalog():Promise<Array<Route>>{
        let catalog:Array<PluginInfo> = await this.pluginManager.getRemotePlugins();
        this.logger.debug("Catalog:",catalog);
        let baseRoute:Route = this.findDashboardRoute(this.router.config);
        let pluginRoutes = this.getActivableRoutesConfig(catalog);
        //return PluginRegistry.getInstance().getRouteConfig(catalog);
        this.patchCompleteRoutes(baseRoute,pluginRoutes);
        return this.router.config;

    }

    patchCompleteRoutes(baseRoute:Route,catalog:Routes):void{
        baseRoute.children = catalog;
    }

    findDashboardRoute(routes:Routes): Route {
        let index = _.findIndex(routes,(route:Route) => {
            return route.path === this.config.dashboardRoute
        })
        if(index === -1){
            return null;
        }
        return routes[index];
    }

    getActivableRoutesConfig(plugins:Array<PluginInfo>):Routes{
        let activablePlugins = PluginRegistry.getInstance().getActivablePlugins(plugins);
        let routes:Routes = [];
        _.forEach(activablePlugins,(entry:PluginRegistrationEntry) => {
            if(entry.routeDef){
                routes.push(entry.routeDef);
            }else{
                routes.push({
                    path:entry.name,
                    component:entry.component
                });
            }
        });
        return routes;
    }

    getInitialRoutes():void{
        let baseRoute:Route = this.findDashboardRoute(this.router.config);

    }
}
