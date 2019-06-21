import { Component, OnInit } from '@angular/core';
import { PluginView,MotifConnectorService } from 'web-console-core';
//import { HttpClient, HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpParams, HttpResponseBase, HttpEventType } from "@angular/common/http";
//import { Observable, forkJoin } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './ext.component.5.html',
  styleUrls: ['./ext.component.css']
})
@PluginView("extf", {
  iconName: 'wa-ico-log'
}
)
export class ExtComponentF implements OnInit{

  curr_date = new Date();

  title = 'app';
  constructor(/** protected httpClient:HttpClient,*/ private mcs:MotifConnectorService){
    console.log("ExtComponent constructor")
  }
  ngOnInit(){
    /*let instance:PluginRegistry = PluginRegistry.getInstance();
    console.log("instance: ",instance);
    let cfg = this.srv.getInitialConfig();
    console.log("cfg: ",cfg);*/
  }
  /*
  testMultipleRequestsRefreshToken() {
    let requests:Array<Observable<any>> = new Array();
    for (let c = 0; c < 20; c++) {
      requests.push(this.httpClient.get("/rest/v2/platform/domains"));
    }

    forkJoin(requests).subscribe((response => {
      console.log("good");
    }),
    (error:any) => {
      console.log("error");
    });
  }
  */
}
