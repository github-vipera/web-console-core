import { Type } from '@angular/core';
import { Routes, Route } from '@angular/router';
export declare class PluginRegistry {
    private pluginMap;
    static getInstance(): PluginRegistry;
    private constructor();
    private createRegistrationEntry(name, value, route);
    registryPluginComponent(name: string, value: Type<any>, route?: Route): void;
    getRouteConfig(): Routes;
}
/**
 * Decorator for plugin registration
 * @param name plugin name; if route is null, this name are used as path
 * @param route
 */
export declare function PluginView(name: string, route?: Route): (target: Type<any>) => void;
export interface PluginRegistrationEntry {
    name: string;
    component?: Type<any>;
    routeDef?: Route;
}
