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

    constructor(private motifConnector:MotifConnectorService, private sbService:StatusBarService){
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        this.sbService.setBusyIndicatorVisibile(true);

        console.log("MotifActivityIndicatorService intercept request");
        return next.handle(request).pipe(tap(event => {
            if (event instanceof HttpResponse) {
                this.sbService.setBusyIndicatorVisibile(false);
	        }
        },(res:any) => {
            if(res instanceof HttpResponse){
                this.sbService.setBusyIndicatorVisibile(false);
            }
        }))
    }


}

