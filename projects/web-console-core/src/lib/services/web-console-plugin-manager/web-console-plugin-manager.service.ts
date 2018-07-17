import { Injectable } from '@angular/core';
import { PluginRegistry , PluginInfo, PluginRegistrationEntry } from '../../commons/PluginRegistry';
import { MotifConnectorService} from '../motif-connector/motif-connector.service';
import * as _ from 'lodash'

const PLUGIN_LIST_ENTRYPOINT = "/rest/v2/registry/plugins?all=true&status=ACTIVE"

@Injectable({
    providedIn: 'root'
})
export class WebConsolePluginManagerService {
    private pluginCatalog:Array<PluginInfo>
    private activePluginsCache:Array<ActivablePlugin>

    constructor(private connector:MotifConnectorService){
        console.log("WebConsolePluginManagerService injected");
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


    private setPluginCatalog(catalog:Array<PluginInfo>):void {
        this.pluginCatalog = catalog;
    }

    private getPluginCatalog():Array<PluginInfo> {
        return this.pluginCatalog;
    }

    private fetchCatalog():Promise<Array<PluginInfo>>{
        return new Promise<Array<PluginInfo>>((resolve,reject) => {
            this.connector.get(PLUGIN_LIST_ENTRYPOINT).subscribe((data) => {
                console.log("Fetch plugin catalog done: ",data);
                this.setPluginCatalog(data);
                resolve(data);
            },reject);
        })
    }

    public getCurrentActivablePlugins():Array<ActivablePlugin>{
        if(!this.activePluginsCache){
            this.activePluginsCache = this.getActivablePlugins(this.pluginCatalog);
        }
        return this.activePluginsCache;
    }

    private getActivablePlugins(motifPlugins:Array<PluginInfo>):Array<ActivablePlugin>{
        let plugins:Array<ActivablePlugin> = [];
        let availablePlugins = PluginRegistry.getInstance().getAllPlugins();
        _.forEach(availablePlugins,(entry:PluginRegistrationEntry,key:string) => {
            if(!this.checkDeps(entry,motifPlugins)){
                console.error("Plugin",entry.name,"removed");
            }else{
                plugins.push(this.createActivableRecord(entry));
            }
        })
        return plugins;
    }

    private createActivableRecord(entry: PluginRegistrationEntry):ActivablePlugin{
        let label:string = entry.name;
        let link:string =  entry.routeDef ? entry.routeDef.path : entry.name;
        return {
            label:label,
            baseInfo:entry,
            link: link
        };
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



export interface ActivablePlugin {
    label:string,
    link:string,
    baseInfo:PluginRegistrationEntry
  }
