import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PluginRegistry } from '../../index';
import { Route } from '@angular/router';
import { Router } from '@angular/router';


@Injectable()
export class WebAdminPluginManagerService {
    private pluginCatalog:Array<any>
    constructor(){
        console.log("WebAdminPluginManagerService injected");
    }
    createRouteConfigFromCatalog():Array<Route>{
        //TODO fetch plugin from server and merge data with this config
        return PluginRegistry.getInstance().getRouteConfig();
    }
}

export interface PluginInfo{
    getPluginId():string
    getPluginDescription():string
}
