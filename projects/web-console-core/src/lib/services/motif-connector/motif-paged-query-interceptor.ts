import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient, HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpParams } from "@angular/common/http";
import { Observable} from "rxjs";
import { tap } from 'rxjs/operators'
import { MotifPagedQuery } from './motif-query.service'
import { NGXLogger } from 'ngx-logger'

export const MOTIF_PAGED_QUERY_PARAM = "__$motif_paged_query"

@Injectable({
    providedIn: 'root'
})
export class MotifPagedQueryInterceptor implements HttpInterceptor {

    constructor(private logger: NGXLogger){
        logger.debug("MotifPagedQueryInterceptor ctor");
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        if (request.params && request.params.has(MOTIF_PAGED_QUERY_PARAM)){

            let motifPagedQuery:MotifPagedQuery = MotifPagedQuery.fromJSON(JSON.parse(request.params.get(MOTIF_PAGED_QUERY_PARAM)));

            this.logger.debug("MotifPagedQueryInterceptor paged request intercepted", motifPagedQuery);

            let params = new HttpParams();

            // encode query params            
            params = motifPagedQuery.encode(params);

            request = request.clone({
                params: params
            });

            this.logger.debug("MotifPagedQueryInterceptor paged request params", request.params);

        }
        return next.handle(request).pipe(tap(() => {
            this.logger.trace("MotifPagedQueryInterceptor Interceptor req done", request);
        },(res:any) => {
            this.logger.trace("MotifPagedQueryInterceptor Interceptor res", res);
        }))
    }

}
