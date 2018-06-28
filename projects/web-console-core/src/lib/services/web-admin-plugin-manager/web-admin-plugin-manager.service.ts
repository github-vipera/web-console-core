import { Injectable } from '@angular/core';
import { PluginRegistry , PluginInfo } from '../../commons/';
import { Route } from '@angular/router';
import { MotifConnectorService} from '../motif-connector/motif-connector.service';


const PLUGIN_LIST_ENTRYPOINT = "/rest/registry/plugin/list?all=true&status=ACTIVE"

@Injectable({
    providedIn: 'root'
})
export class WebAdminPluginManagerService {
    private pluginCatalog:Array<PluginInfo>
    constructor(private connector:MotifConnectorService){
        console.log("WebAdminPluginManagerService injected");
    }
    /*
      async createRouteConfigFromCatalog():Promise<Array<Route>>{
        let catalog:Array<PluginInfo> = await this.fetchCatalog();
        console.log("Catalog:",catalog);
        return PluginRegistry.getInstance().getRouteConfig(catalog);
    }*/

    async getRemotePlugins(){
        let catalog:Array<PluginInfo> = await this.fetchCatalog();
        console.log("Catalog:",catalog);
        return catalog;
    }

    getInitialConfig():Array<Route>{
        //return PluginRegistry.getInstance().getRouteConfig([],false);
        return null;
    }

    private fetchCatalog():Promise<Array<PluginInfo>>{
        return new Promise<Array<PluginInfo>>((resolve,reject) => {
            this.connector.get(PLUGIN_LIST_ENTRYPOINT).subscribe((data) => {
                resolve(data);
            },reject);
        })
    }
}

