import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MotifConnectorService } from "./motif-connector.service";
import { NGXLogger } from 'ngx-logger';

export enum MotifQuerySortDirection {
    Ascending,
    Descending
}

export interface MotifQueryFieldSort {
    fieldName:string,
    direction:MotifQuerySortDirection
}

export interface MotifQueryResults {
    pageIndex?:number;
    pageSize?:number;
    totalRecords:number;
    sort?:MotifQueryFieldSort[];
    filter?:any;
    data:any;
}


@Injectable({
    providedIn: 'root'
})
export class MotifQueryService {

    constructor(private motifConnector:MotifConnectorService, private logger: NGXLogger) { 
        this.logger.debug("MotifQueryService","constructor");

    }

    public query(url:string,pageIndex?:number,pageSize?:number,sort?:MotifQueryFieldSort[],filter?:any,options?:any):Observable<MotifQueryResults>{
        this.logger.debug("MotifQueryService","query called",url,pageIndex,pageSize,options);
        return Observable.create((observer:any) => {
            if (!options){
                options = {};
            }
            if (pageIndex){
                options.page = pageIndex;
            }
            if (pageSize){
                options.page_size = pageSize;
            }
            if (sort){
                //options.sort = TODO!!;
            }
            if (filter){
                //options.filter = TODO!!;
            }
            options.observe = "response"; // to display the full response with headers

            let observable = this.motifConnector.get(url,options).subscribe((data) => {
                this.logger.debug("MotifQueryService","Get Users List done",data);
                //TODO!! get from link protocol
                let results:MotifQueryResults = {
                    data : data.body,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    totalRecords: -1
                };
                observer.next(results);
            });
        });


    }

}




