import { Type } from '@angular/core';
import { Routes, Route } from '@angular/router';
export declare class PluginRegistry {
    private pluginMap;
    static getInstance(): PluginRegistry;
    private constructor();
    private createRegistrationEntry(name, value, info);
    registryPluginComponent(name: string, value: Type<any>, info?: RegistrationInfo): void;
    getRouteConfig(plugins: Array<PluginInfo>, checkDeps?: boolean): Routes;
    private checkDeps(entry, plugins);
}
/**
 * Decorator for plugin registration
 * @param name plugin name; if route is null, this name are used as path
 * @param route
 */
export declare function PluginView(name: string, info?: RegistrationInfo): (target: Type<any>) => void;
export interface RegistrationInfo {
    route?: Route;
    dependencies?: Array<PluginInfo>;
}
export interface PluginInfo {
    name: string;
    version: string;
}
export interface PluginRegistrationEntry {
    name: string;
    component?: Type<any>;
    routeDef?: Route;
    dependencies?: Array<PluginInfo>;
}
