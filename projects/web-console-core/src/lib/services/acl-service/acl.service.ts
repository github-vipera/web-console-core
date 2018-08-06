import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { MotifConnectorService } from '../motif-connector/motif-connector.service'
import { NGXLogger } from 'ngx-logger';

interface Map<T> {
    [K: string]: T;
}

@Injectable({
    providedIn: 'root'
})
export class ACLService {

    /**
     * List of cached permissions
     */
    private _permissions:Map<string> = {};

    constructor(private motifConnector:MotifConnectorService, private logger: NGXLogger) { 
        this.logger.debug("ACLService","constructor");
    }

    /**
     * Add permissions into the cache
     * @param permissions
     */
    public addPermissions(permissions:Array<string>):void{
        for (var i=0;i<permissions.length;i++){
            let permission = permissions[i];
            this._permissions[permission] = permission;
        }
    }

    /**
     * Remove all cached permissions
     */
    public flushPermissions():void{
        this._permissions = {};
    }


    /**
     * Does current user have permission to do something?
     * 
     * @param permission 
     */
    public can(permission:string|string[]):boolean {
        if (typeof permission==='string'){
            return this.checkSingle(permission);
        } else {
            return this.checkMultiple(permission);
        }
    }

    /**
     * Check for single permission
     * @param permission 
     */
    private checkSingle(permission:string):boolean {
        if (this._permissions.entries.length===0){
            return false; //no permission available
        }
        return (this._permissions[permission]!=null);
    }

    /**
     * Check for multiple permissions
     * @param permissions 
     */
    private checkMultiple(permissions:string[]):boolean {
        let retValue = false;
        for (let i=0;i<permissions.length;i++){
            if (!this.checkSingle(permissions[i])){
                return false;
            }
            retValue = true;
        }
        return retValue;
    }

    /**
     * Does current user have permission to do something?
     * 
     * @param permission 
     */
    public canAll(permissions:string[]):boolean {
        for (let i=0;i<permissions.length;i++){
            if (!this.can(permissions[i])){
                return false;
            }
        }
        return true;
    }

    /**
     * 
     * @param array Remove duplicates
     */
    private arrayUnique(array:Array<string>):Array<string> {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    }

}