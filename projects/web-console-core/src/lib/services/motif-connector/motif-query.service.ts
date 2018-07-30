import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MotifConnectorService } from "web-console-core"

@Injectable({
    providedIn: 'root'
})
export class MotifQueryService {

    constructor(private motifConnector:MotifConnectorService) { 
        console.log("MotifQueryService","constructor");
    }

    public query(url:string,pageIndex:number,pageSize:number,options?:any):Observable<MotifQueryResponse>{
        console.log("MotifQueryService","query");
        //TODO!!
        return this.motifConnector.get(url,options);
    }

}

export interface MotifQueryResponse {
    pageIndex:number;
    pageSize:number;
    totalRecords:number;
    data:any;
}


