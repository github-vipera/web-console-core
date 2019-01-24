import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable({
    providedIn: 'root'
})
export class MotifConnectorService {
    constructor(private logger:NGXLogger, private httpClient: HttpClient) {
        this.logger.debug("MotifConnectorService","constructor");
    }

    post(url:string,request:ServiceRequest,options?:any):Observable<any>{
        return this.httpClient.post(url,request,options || {});
    }

    get(url:string,options?:any):Observable<any>{
        return this.httpClient.get(url,options || {})
    }

    put(url:string,request:ServiceRequest,options?:any):Observable<any>{
        return this.httpClient.put(url,request,options || {})
    }

    delete(url:string,options?:any):Observable<any>{
        return this.httpClient.delete(url, options || {})
    }
}

export interface ServiceRequest{
    [props:string]:any
}

export interface ServiceResponse{
    [props:string]:any
}

