import { Injectable } from '@angular/core';
import { PluginRegistry , PluginInfo, PluginRegistrationEntry } from '../../commons/PluginRegistry';
import { MotifConnectorService} from '../motif-connector/motif-connector.service';
import * as _ from 'lodash'

const PLUGIN_LIST_ENTRYPOINT = "/rest/registry/plugin/list?all=true&status=ACTIVE"

@Injectable({
    providedIn: 'root'
})
export class WebAdminPluginManagerService {
    private pluginCatalog:Array<PluginInfo>
    private activePluginsCache:Array<PluginRegistrationEntry>

    constructor(private connector:MotifConnectorService){
        console.log("WebAdminPluginManagerService injected");
    }
    /*
      async createRouteConfigFromCatalog():Promise<Array<Route>>{
        let catalog:Array<PluginInfo> = await this.fetchCatalog();
        console.log("Catalog:",catalog);
        return PluginRegistry.getInstance().getRouteConfig(catalog);
    }*/

    public async getRemotePlugins(){
        let catalog:Array<PluginInfo> = await this.fetchCatalog();
        this.pluginCatalog = catalog;
        console.log("Catalog:",catalog);
        return catalog;
    }

    private fetchCatalog():Promise<Array<PluginInfo>>{
        return new Promise<Array<PluginInfo>>((resolve,reject) => {
            this.connector.get(PLUGIN_LIST_ENTRYPOINT).subscribe((data) => {
                resolve(data);
            },reject);
        })
    }

    public getCurrentActivePlugins():Array<PluginRegistrationEntry>{
        if(this.activePluginsCache){
            return this.activePluginsCache;
        }
        this.activePluginsCache = this.getActivablePlugins(this.pluginCatalog);
        return null;
    }

    public getActivablePlugins(motifPlugins:Array<PluginInfo>):Array<PluginRegistrationEntry>{
        let plugins:Array<PluginRegistrationEntry> = [];
        let availablePlugins = PluginRegistry.getInstance().getAllPlugins();
        _.forEach(availablePlugins,(entry:PluginRegistrationEntry,key:string) => {
            if(!this.checkDeps(entry,motifPlugins)){
                console.error("Plugin",entry.name,"removed");
            }else{
                plugins.push(entry);
            }
        })
        return plugins;
    }


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

