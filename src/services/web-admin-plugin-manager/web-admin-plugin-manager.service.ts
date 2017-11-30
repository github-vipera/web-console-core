import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PluginRegistry } from '../../index';
import { Route } from '@angular/router';
import { Router } from '@angular/router';
import { PluginInfo } from '../../commons/index';


@Injectable()
export class WebAdminPluginManagerService {
    private pluginCatalog:Array<any>
    constructor(){
        console.log("WebAdminPluginManagerService injected");
    }
    createRouteConfigFromCatalog():Promise<Array<Route>>{
        //TODO fetch plugin from server and merge data with this config
        return new Promise<Array<Route>>((resolve) => {
            fetch('/rest/registry/plugin/list?all=true').then((response:any) => {
                return response.json();
            }).then((json:any) => {
                let plugins:Array<PluginInfo> = json.Plugins;
                resolve(PluginRegistry.getInstance().getRouteConfig(plugins));
            }).catch((err) => {
                console.error("Error in fetch",err);
            });
        });
        //return null;
    }
}

/*export interface PluginInfo{
    getPluginId():string
    getPluginDescription():string
}*/
