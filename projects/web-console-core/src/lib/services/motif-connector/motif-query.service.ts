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
    private fields:Array<MotifQueryFieldSort> = [];

    
    public orderDescendingBy(fieldName:string):MotifQuerySort{
        return this.addField(fieldName, MotifQuerySortDirection.Descending);
    }

    public orderAscendingBy(fieldName:string):MotifQuerySort{
        return this.addField(fieldName, MotifQuerySortDirection.Ascending);
    }

    public addField(fieldName:string, direction:MotifQuerySortDirection):MotifQuerySort{
        this.fields.push({ fieldName: fieldName, direction: direction});
        return this;
    }

    public encode(params:HttpParams):HttpParams {
        if (this.fields.length==0){
            return null;
        }
        let sortString = "";
        for (var i=0;i<this.fields.length;i++){
            let sortField:MotifQueryFieldSort = this.fields[i];
            if (sortField.direction === MotifQuerySortDirection.Descending){
                sortString = sortString + "-";
            }
            sortString = sortString + sortField.fieldName;
            if (i!=(this.fields.length-1)){
                sortString = sortString + ",";
            }
        }
        params = params.set("sort", sortString);
        return params;
    }
}

export enum MotifQueryFilterFieldOperator {
    Equals,
    NotEqual,
    GreaterThan,
    LessThan,
    Between,
    LessThanEqual,
    GreaterThanEqual
}

export interface MotifQueryFilterField {
    fieldName:string,
    filterOperator:MotifQueryFilterFieldOperator,
    value:any,
    value2?:any
}

export class MotifQueryFilter {
    private fields:Array<MotifQueryFilterField> = [];

    public greaterThan(fieldName:string, value:any):MotifQueryFilter{
        this.fields.push({ fieldName: fieldName, filterOperator: MotifQueryFilterFieldOperator.GreaterThan, value: value});
        return this;
    }

    public between(fieldName:string, value1:any, value2:any):MotifQueryFilter{
        this.fields.push({ fieldName: fieldName, filterOperator: MotifQueryFilterFieldOperator.Between, value: value1, value2: value2});
        return this;
    }

    public equals(fieldName:string, value:any):MotifQueryFilter{
        this.fields.push({ fieldName: fieldName, filterOperator: MotifQueryFilterFieldOperator.Equals, value: value});
        return this;
    }

    public greaterThanEqual(fieldName:string, value:any):MotifQueryFilter{
        this.fields.push({ fieldName: fieldName, filterOperator: MotifQueryFilterFieldOperator.GreaterThanEqual, value: value});
        return this;
    }

    public lessThan(fieldName:string, value:any):MotifQueryFilter{
        this.fields.push({ fieldName: fieldName, filterOperator: MotifQueryFilterFieldOperator.LessThan, value: value});
        return this;
    }

    public lessThanEqual(fieldName:string, value:any):MotifQueryFilter{
        this.fields.push({ fieldName: fieldName, filterOperator: MotifQueryFilterFieldOperator.LessThanEqual, value: value});
        return this;
    }

    public notEqual(fieldName:string, value:any):MotifQueryFilter{
        this.fields.push({ fieldName: fieldName, filterOperator: MotifQueryFilterFieldOperator.NotEqual, value: value});
        return this;
    }

    public encode(params:HttpParams):HttpParams {
        if (this.fields.length==0){
            return null;
        }
        for (var i=0;i<this.fields.length;i++){
            let filterField:MotifQueryFilterField = this.fields[i];
            let operator = this.encodeOperator(filterField.filterOperator);
            let valueStr = this.encodeValue(filterField);
            params = params.set(filterField.fieldName, operator + valueStr);
        }
        return params;
    }

    private encodeValue(filterField:MotifQueryFilterField):string{
        if (filterField.filterOperator===MotifQueryFilterFieldOperator.Between){
            return filterField.value +","+ filterField.value2;
        } else {
            return filterField.value;
        }
    }

    private encodeOperator(filterOperator:MotifQueryFilterFieldOperator):string{
        if (filterOperator===MotifQueryFilterFieldOperator.Between){
            return "bt:";
        }
        else if (filterOperator===MotifQueryFilterFieldOperator.Equals){
            return "";
        }
        else if (filterOperator===MotifQueryFilterFieldOperator.GreaterThan){
            return "gt:";
        }
        else if (filterOperator===MotifQueryFilterFieldOperator.GreaterThanEqual){
            return "gte:";
        }
        else if (filterOperator===MotifQueryFilterFieldOperator.LessThan){
            return "lt:";
        }
        else if (filterOperator===MotifQueryFilterFieldOperator.LessThanEqual){
            return "lte:";
        }
        else if (filterOperator===MotifQueryFilterFieldOperator.NotEqual){
            return "not:";
        }
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
                params = sort.encode(params);
            }
            
            if (filter){
                params = filter.encode(params);
            }

            // Create Options
            if (!options){
                options = {};
            }
            options.params = params;
            options.observe = "response"; // => to receive the full response with headers

            let observable = this.motifConnector.get(url,options).subscribe((response) => {
                this.logger.debug("MotifQueryService","Get Users List done",response.url);

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