import { Route, Routes } from "@angular/router";
import * as _ from 'lodash'

export interface PluginRouteData {
    pluginName:string;
    pluginIcon?:string;
    [key:string]:any;
}


export function resolveRoutes(requiredPlugins:Array<string>,inputRoutes:Routes):Routes{
    console.log("resolveRoutes... requiredPlugins: ",requiredPlugins, ", inputRoutes: ",inputRoutes);
    let result:Array<Route> = [];
    _.forEach(requiredPlugins,(pluginName:String) => {
        let route:Route = _.find(inputRoutes,(singleRoute:Route)=>{
            if(!singleRoute.data && singleRoute.data.pluginName){
                console.log("route don't provide data: skip this");
                //TODO evaluate component equals resolution using PluginRegistry
                return false;
            }
            let routeData:PluginRouteData = <PluginRouteData>singleRoute.data;
            return routeData.pluginName === pluginName;
        });
        if(route){
            result.push(route);
        }
    });
    return result;
}

