import { NGXLogger } from 'ngx-logger';
import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpParams } from "@angular/common/http";
import { Observable} from "rxjs";
import { tap } from 'rxjs/operators'
import { MotifConnectorService } from "./motif-connector.service";
import { StatusBarService } from '../../components/status-bar/status-bar.service'

@Injectable({
    providedIn: 'root'
})
export class MotifActivityIndicatorService implements HttpInterceptor{

    constructor(private logger:NGXLogger, private motifConnector:MotifConnectorService, private sbService:StatusBarService){
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        this.sbService.setBusyIndicatorVisibile(true);

        this.logger.debug("MotifActivityIndicatorService intercept request");
        return next.handle(request).pipe(tap(event => {
            if (event instanceof HttpResponse) {
                this.sbService.setBusyIndicatorVisibile(false);
            } else if (event instanceof HttpErrorResponse) {
                this.sbService.setBusyIndicatorVisibile(false);
            }
        },(res:any) => {
            if(res instanceof HttpResponse){
                this.sbService.setBusyIndicatorVisibile(false);
            } else if (res instanceof HttpErrorResponse) {
                this.sbService.setBusyIndicatorVisibile(false);
            }
        }))
    }


}

