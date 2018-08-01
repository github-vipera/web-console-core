import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MotifConnectorService } from "./motif-connector.service"
import { NGXLogger } from 'ngx-logger';
import { HttpParams } from '@angular/common/http';

export enum MotifQuerySortDirection {
    Ascending,
    Descending
}

export interface MotifQueryFieldSort {
    fieldName:string,
    direction:MotifQuerySortDirection
}

export class MotifQuerySort {
    private fields:Array<MotifQueryFieldSort>;
    public addField(fieldName:string, direction:MotifQuerySortDirection):MotifQuerySort{
        this.fields.push({ fieldName: fieldName, direction: direction});
        return this;
    }
    public encode():string {
        if (this.fields.length==0){
            return null;
        }
        return "TODO!!";
    }
}

export interface MotifQueryFilterField {
    fieldName:string,
    filterType:string,
    value:any
}

export class MotifQueryFilter {
    private fields:Array<MotifQueryFilterField>;

    public addField(fieldName:string, filterType:string, value:any):MotifQueryFilter{
        this.fields.push({ fieldName: fieldName, filterType: filterType, value: value});
        return this;
    }
    public encode():string {
        if (this.fields.length==0){
            return null;
        }
        return "TODO!!";
    }
}


export interface MotifQueryResults {
    pageIndex:number;
    pageSize:number;
    totalRecords:number;
    totalPages:number;
    data:any;
    link?:string;
    sort?:MotifQuerySort;
    filter?:any;
}


@Injectable({
    providedIn: 'root'
})
export class MotifQueryService {

    constructor(private motifConnector:MotifConnectorService, private logger: NGXLogger) { 
        this.logger.debug("MotifQueryService","constructor");

    }

    public query(url:string,pageIndex?:number,pageSize?:number,sort?:MotifQuerySort,filter?:MotifQueryFilter,options?:any):Observable<MotifQueryResults>{
        this.logger.debug("MotifQueryService","query called",url,pageIndex,pageSize,options);
        return Observable.create((observer:any) => {
            
            // Set the query params
            let params = new HttpParams()
                .set('page_size', ""+pageSize)
                .set('page', ""+pageIndex)
            if (sort){
                params = params.set('sort',sort.encode())
            }
            if (filter){
                params = params.set('filter',filter.encode())
            }

            // Create Options
            if (!options){
                options = {};
            }
            options.params = params;
            options.observe = "response"; // => to receive the full response with headers

            let observable = this.motifConnector.get(url,options).subscribe((response) => {
                this.logger.debug("MotifQueryService","Get Users List done",response);

                let pageIndexRes = response.headers.get('x-page');
                let pageSizeRes = response.headers.get('x-page-size');
                let totalPagesRes = response.headers.get('x-total-pages');
                let totalRecordsRes = response.headers.get('x-total-records');
                let linkRes = response.headers.get('Link');

                let results:MotifQueryResults = {
                    data : response.body,
                    pageIndex: pageIndexRes,
                    pageSize: pageSizeRes,
                    totalPages: totalPagesRes,
                    totalRecords: totalRecordsRes,
                    link:linkRes,
                    sort:sort,
                    filter:filter
                };
                observer.next(results);
            });
        });


    }

}




