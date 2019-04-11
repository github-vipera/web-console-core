import { Injectable } from '@angular/core';
import { PluginRegistry , PluginInfo, PluginRegistrationEntry } from '../../commons/PluginRegistry';
import { MotifConnectorService} from '../motif-connector/motif-connector.service';
import * as _ from 'lodash'
import { NGXLogger } from 'ngx-logger';
import { Router, Routes, Route } from '@angular/router';

const PLUGIN_LIST_ENTRYPOINT = "/rest/v2/registry/plugins?all=true&status=ACTIVE"

@Injectable({
    providedIn: 'root'
})
export class WebConsolePluginManagerService {
    private pluginCatalog:Array<PluginInfo>
    private activePluginsCache:Array<ActivablePlugin>

    constructor(private logger:NGXLogger, private connector:MotifConnectorService, private router:Router){
        this.logger.debug("WebConsolePluginManagerService injected");
    }
    /*
      async createRouteConfigFromCatalog():Promise<Array<Route>>{
        let catalog:Array<PluginInfo> = await this.fetchCatalog();
        this.logger.debug("Catalog:",catalog);
        return PluginRegistry.getInstance().getRouteConfig(catalog);
    }*/

    public async getRemotePlugins(){
        let catalog:Array<PluginInfo> = await this.fetchCatalog();
        this.pluginCatalog = catalog;
        this.logger.debug("Catalog:",catalog);
        return catalog;
    }


    private setPluginCatalog(catalog:Array<PluginInfo>):void {
        this.pluginCatalog = catalog;
    }

    private getPluginCatalog():Array<PluginInfo> {
        return this.pluginCatalog;
    }

    private fetchCatalog():Promise<Array<PluginInfo>>{
        return new Promise<Array<PluginInfo>>((resolve,reject) => {
            this.connector.get(PLUGIN_LIST_ENTRYPOINT).subscribe((data) => {
                this.logger.debug("Fetch plugin catalog done: ",data);
                this.setPluginCatalog(data);
                resolve(data);
            },reject);
        })
    }

    public getCurrentActivablePlugins(baseRoute:Route):Array<ActivablePlugin>{
        if(!this.activePluginsCache){
            this.activePluginsCache = this.getActivablePlugins(this.pluginCatalog,baseRoute);
        }
        return this.activePluginsCache;
    }

    private getActivablePlugins(motifPlugins:Array<PluginInfo>,dashboardRoute:Route):Array<ActivablePlugin>{
        let plugins:Array<ActivablePlugin> = [];
        let availablePlugins = PluginRegistry.getInstance().getAllPlugins();
        _.forEach(availablePlugins,(entry:PluginRegistrationEntry,key:string) => {
            if(!this.checkDeps(entry,motifPlugins)){
                console.error("Plugin",entry.name,"removed");
            }else{
                let record = this.createActivableRecord(entry,dashboardRoute);
                if(record == null){
                    console.log("Plugin removed by not configured route... plugin:",entry);
                    return;
                }
                plugins.push(record);
            }
        })
        return plugins;
    }

    private createActivableRecord(entry: PluginRegistrationEntry,dashboardRoute:Route):ActivablePlugin{
        /*let label:string = entry.name;
        //let link:string =  entry.routeDef ? entry.routeDef.path : entry.name;
        let link = this.resolveInternalLink(entry,dashboardRoute.children);
        if(!link){
            return null;
        }
        return {
            label:label,
            baseInfo:entry,
            link: link
        };*/
        return this.resolveActivablePluginInfo(entry,dashboardRoute.children);
    }

    private resolveActivablePluginInfo(entry: PluginRegistrationEntry, pluginRoutes: Routes):ActivablePlugin{
        let route:Route = _.find(pluginRoutes, (toCheck:Route) => {
            let routeData = toCheck.data;
            if(!routeData){
                if(toCheck.component && toCheck.component == entry.component){
                    return true
                }
                return false;
            }
            let pluginName:string = routeData.pluginName;
            return pluginName === entry.name;
        });
        if(route){
            return {
                label:entry.name,
                baseInfo:entry,
                link: route.path
            }; 
        }
        return null;
    }

    /*
    resolveInternalLink(entry: PluginRegistrationEntry, pluginRoutes: Routes): string {
        let route:Route = _.find(pluginRoutes, (toCheck:Route) => {
            let routeData = toCheck.data;
            if(!routeData){
                if(toCheck.component && toCheck.component == entry.component){
                    return true
                }
                return false;
            }
            let pluginName:string = routeData.pluginName;
            return pluginName === entry.name;
        });
        if(route){
            return route.path;
        }
        return null;
    }
    */



    private checkDeps(entry:PluginRegistrationEntry,plugins:Array<PluginInfo>):boolean{
        try{
         _.forEach(entry.dependencies || [],(info:PluginInfo) => {
            if(_.findIndex(plugins || [],(single:PluginInfo) => {return info.name == single.name}) == -1){
               throw new Error("Plugin not found:" + info.name);
            }
         });
         return true;
        }catch(ex){
          console.error("invalid plugin info",ex);
          return false;
        }
     }
}



export interface ActivablePlugin {
    label:string,
    link?:string,
    baseInfo:PluginRegistrationEntry
  }
