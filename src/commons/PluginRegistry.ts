const _:any = require('lodash');
import { retry } from 'rxjs/operators/retry';
import {Type} from '@angular/core'
import { Routes,Route } from '@angular/router';
import { WebAdminConsoleComponent } from '../components/index';
let instance:PluginRegistry = undefined;
export class PluginRegistry {
    private pluginMap: { [key:string]:PluginRegistrationEntry; } = {};
    static getInstance():PluginRegistry{
        if(instance == null){
            instance = new PluginRegistry();
        }
        return instance;
    }
    private constructor(){
        console.log("Create component registry");
    }

    private createRegistrationEntry(name:string,value:Type<any>,route:Route):PluginRegistrationEntry{
        return {
            name:name,
            component:value,
            routeDef: route
        };
    }

    registryPluginComponent(name:string,value:Type<any>,route?:Route){
        console.log("registryPluginComponent",value);
        const entry:PluginRegistrationEntry = this.createRegistrationEntry(name,value,route);
        this.pluginMap[name] = entry;
    }

    getRouteConfig():Routes{
        let info:Routes = [];
        _.forEach(this.pluginMap,(entry:PluginRegistrationEntry,key:string) => {
            if(entry.routeDef){
                info.push(entry.routeDef);
            }else{
                info.push({
                    path:key,
                    component:entry.component
                });
            }
        });   
        return info;
    }
}


/**
 * Decorator for plugin registration
 * @param name plugin name; if route is null, this name are used as path
 * @param route 
 */
export function PluginView(name:string,route?:Route){
    console.log("pluginview decorator called",name);
    return (target:Type<any>) => {
        PluginRegistry.getInstance().registryPluginComponent(name,target,route);
    }
}


export interface PluginRegistrationEntry{
    name:string,
    component?:Type<any>
    routeDef?:Route
}
