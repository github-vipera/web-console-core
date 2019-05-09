import { ServiceLocator } from './../service.locator';
import { NGXLogger } from 'ngx-logger';
//declare const require: any;
//const _:any = require('lodash');
import {Type} from '@angular/core'
import { Route } from '@angular/router';
import * as _ from 'lodash'


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
      console.log("PluginRegistry constructor");
    }

    private createRegistrationEntry(name:string,value:Type<any>,info:RegistrationInfo):PluginRegistrationEntry{
        let registrationEntry:PluginRegistrationEntry = {
            name:name,
            component:value
        };
        if(info){
            //registrationEntry.routeDef = info.route;
            registrationEntry.dependencies = info.dependencies;
            registrationEntry.customIcon = info.customIcon;
            registrationEntry.iconName = info.iconName;
            registrationEntry.index = (info.index ? info.index : 99999);
            registrationEntry.userData = (info.userData ? info.userData : null) ;

        }
        return registrationEntry;
    }

    registryPluginComponent(name:string,value:Type<any>,info?:RegistrationInfo){
        console.log("registryPluginComponent name:",name,"value: ",value);
        const entry:PluginRegistrationEntry = this.createRegistrationEntry(name,value,info);
        console.log("entry:", entry);
        this.pluginMap[name] = entry;
    }

    /*getRouteConfig(plugins:Array<PluginInfo>,checkDeps:boolean=true):Routes{
        let info:Routes = [];
        _.forEach(this.pluginMap,(entry:PluginRegistrationEntry,key:string) => {
            if(checkDeps && !this.checkDeps(entry,plugins)){
                console.error("Plugin",entry.name,"removed");
            }else{
                if(entry.routeDef){
                    info.push(entry.routeDef);
                }else{
                    info.push({
                        path:key,
                        component:entry.component
                    });
                }
            }

        });
        return info;
    }*/

    public getActivablePlugins(motifPlugins:Array<PluginInfo>):Array<PluginRegistrationEntry>{
        let plugins:Array<PluginRegistrationEntry> = [];
        _.forEach(this.pluginMap,(entry:PluginRegistrationEntry,key:string) => {
            if(!this.checkDeps(entry,motifPlugins)){
                console.error("Plugin",entry.name,"removed");
            }else{
                plugins.push(entry);
            }
        })
        return plugins;
    }

    public getAllPlugins():Array<PluginRegistrationEntry>{
        let plugins:Array<PluginRegistrationEntry> = [];
        _.forEach(this.pluginMap,(entry:PluginRegistrationEntry,key:string) => {
            plugins.push(entry)
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

    public isPluginAvailable(pluginName:string):boolean{
        return this.pluginMap[pluginName] != null;
    }

    public isComponentPlugin(pluginName:string,componentToCheck){
        console.log("check if component is a plugin name: ; componentToCheck: ",pluginName,componentToCheck)
        if(!componentToCheck){
            return false;
        }
        /*for (let key in this.pluginMap) {
            if (this.pluginMap.hasOwnProperty(key)) {
              let value:PluginRegistrationEntry = this.pluginMap[key];
              if(!value){
                  return false;
              }
              return value.component === componentToCheck;
            }
        }*/
        let value:PluginRegistrationEntry = this.pluginMap[pluginName];
        if(!value){
            return false;
        }
        return value.component === componentToCheck;
    }
}


/**
 * Decorator for plugin registration
 * @param name plugin name; if route is null, this name are used as path
 * @param route
 */
export function PluginView(name:string,info?:RegistrationInfo){
    //console.debug("PluginView decorator called: ",name, "Registration Info:",info);
    return (target:Type<any>) => {
        PluginRegistry.getInstance().registryPluginComponent(name,target,info);
    }
}

export interface RegistrationInfo {
    //route?:Route,
    dependencies?:Array<PluginInfo>;
    customIcon?:string;
    iconName?:string;
    index?:number;
    userData?: any;
}


export interface PluginInfo {
    name:string,
    version:string
}

export interface PluginRegistrationEntry {
    name:string,
    component?:Type<any>
    routeDef?:Route
    dependencies?:Array<PluginInfo>
    customIcon?:string
    iconName?:string
    index?:number;
    userData?:any;
}
