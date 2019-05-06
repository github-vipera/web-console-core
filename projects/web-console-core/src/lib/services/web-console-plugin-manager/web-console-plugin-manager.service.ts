import { Injectable } from '@angular/core';
import { PluginRegistry , PluginInfo, PluginRegistrationEntry } from '../../commons/PluginRegistry';
import { MotifConnectorService} from '../motif-connector/motif-connector.service';
import * as _ from 'lodash'
import { NGXLogger } from 'ngx-logger';
import { Router, Routes, Route } from '@angular/router';
import { md5 } from '../../commons/md5';
import { basename } from 'path';

const LOG_TAG = "[WebConsolePluginManagerService]"

const PLUGIN_LIST_ENTRYPOINT = "/rest/v2/registry/plugins?all=true&status=ACTIVE"

export abstract class AbstractPluginValidator {
  constructor() { }
  abstract validatePluginEntry(entry:PluginRegistrationEntry):boolean;
}

@Injectable({
    providedIn: 'root'
})
export class WebConsolePluginManagerService {

    private pluginCatalog:Array<PluginInfo>;
    private activePluginsCache:Array<ActivablePlugin>;
    private pluginValidators:Array<AbstractPluginValidator> = [];

    constructor(private logger:NGXLogger, private connector:MotifConnectorService, private router:Router){
        this.logger.debug(LOG_TAG, "WebConsolePluginManagerService injected");
    }

    public async getRemotePlugins(){
        let catalog:Array<PluginInfo> = await this.fetchCatalog();
        this.pluginCatalog = catalog;
        this.logger.debug(LOG_TAG, "Catalog:",catalog);
        return catalog;
    }

    public registerPluginValidator(validator: AbstractPluginValidator){
      this.logger.debug(LOG_TAG, "registerPluginValidator called for :",validator);
      this.pluginValidators.push(validator);
    }

    public unregisterPluginValidator(validator: AbstractPluginValidator){
      for( var i = 0; i < this.pluginValidators.length; i++){
        if ( this.pluginValidators[i] === validator) {
          this.pluginValidators.splice(i, 1);
          return;
        }
      }
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
                this.logger.debug(LOG_TAG, "Fetch plugin catalog done: ",data);
                this.setPluginCatalog(data);
                resolve(data);
            },reject);
        })
    }

    public getCurrentActivablePlugins(baseRoute:Route):Array<ActivablePlugin>{
        this.logger.debug(LOG_TAG, "getCurrentActivablePlugins called for: ",baseRoute);
        if(!this.activePluginsCache){
          this.logger.debug(LOG_TAG, "Cache not available");
          this.activePluginsCache = this.getActivablePlugins(this.pluginCatalog,baseRoute);
          this.logger.debug(LOG_TAG, "New cache : ", this.activePluginsCache);
        }
        return this.activePluginsCache;
    }

    private getActivablePlugins(motifPlugins:Array<PluginInfo>,dashboardRoute:Route):Array<ActivablePlugin>{
      this.logger.debug(LOG_TAG, "getActivablePlugins called for: ", motifPlugins, dashboardRoute);
      let plugins:Array<ActivablePlugin> = [];
        let availablePlugins = PluginRegistry.getInstance().getAllPlugins();
        _.forEach(availablePlugins,(entry:PluginRegistrationEntry,key:string) => {
            if( !(this.checkDeps(entry,motifPlugins)) || !(this.checkAvailability(entry)) ){
              this.logger.debug(LOG_TAG, "this plugin is NOT eligible for the toolbar:", entry);
              this.logger.warn(LOG_TAG, "Plugin ",entry.name," removed");
            } else {
              this.logger.debug(LOG_TAG, "this plugin is eligible for the toolbar:", entry);
              let record = this.createActivableRecord(entry,dashboardRoute);
                if(record == null){
                  this.logger.warn(LOG_TAG, "Plugin removed by not configured route... plugin:", entry);
                } else {
                  plugins.push(record);
                }
            }
        })
        plugins = _.orderBy(plugins, ['index'],['asc']);
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
                index: (entry.index ? entry.index : -1),
                id: md5(entry.name),
                label:entry.name,
                baseInfo:entry,
                link: route.path
            };
        }
        return null;
    }

    /**
     * it requests an availability check from an external and pluggable handler
     * @param entry
     */
    private checkAvailability(entry:PluginRegistrationEntry):boolean {
      let ret:boolean = true;
      var BreakException = {};
      this.logger.debug(LOG_TAG, "checkAvailability called for: ", entry, this.pluginValidators);
      try {
        this.pluginValidators.forEach( (element:AbstractPluginValidator) => {
          if (!element.validatePluginEntry(entry)){
            this.logger.warn(LOG_TAG, "This entry is not eligible for validator : ", entry, element);
            ret = false;
            throw BreakException;
          }
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      return ret;
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
          this.logger.error(LOG_TAG, "invalid plugin info",ex);
          return false;
        }
     }
}



export interface ActivablePlugin {
    id:string,
    label:string,
    link?:string,
    index?:number,
    baseInfo:PluginRegistrationEntry
  }
