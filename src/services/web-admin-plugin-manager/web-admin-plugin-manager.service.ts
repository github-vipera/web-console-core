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
    async createRouteConfigFromCatalog():Promise<Array<Route>>{
        /*return new Promise<Array<Route>>((resolve) => {
            fetch('/rest/registry/plugin/list?all=true').then((response:any) => {
                return response.json();
            }).then((json:any) => {
                let plugins:Array<PluginInfo> = json.Plugin;
                resolve(PluginRegistry.getInstance().getRouteConfig(plugins));
            }).catch((err) => {
                console.error("Error in fetch",err);
            });
        });*/
        /*return new Promise<Array<Route>>((resolve,reject) => {
            this.fetchCatalog().then((catalog) => {
                resolve(PluginRegistry.getInstance().getRouteConfig(catalog));
            },reject);
        });*/
        let catalog:Array<PluginInfo> = await this.fetchCatalog();
        console.log("Catalog:",catalog);
        return PluginRegistry.getInstance().getRouteConfig(catalog);
    }

    private  fetchCatalog():Promise<Array<PluginInfo>>{
        return new Promise<Array<PluginInfo>>((resolve,reject) => {
            fetch('/rest/registry/plugin/list?all=true').then((response:Response) => {
                if(response.ok){
                  return response.json();               
                }
                return Promise.reject(response);
            },reject).then((json:any) => {
                let plugins:Array<PluginInfo> = json.Plugin;
                resolve(json.Plugin);
            },reject);
        });
    }
}

