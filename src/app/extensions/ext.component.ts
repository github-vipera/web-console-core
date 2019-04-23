import { Component, OnInit } from '@angular/core';
import { PluginView,MotifConnectorService } from 'web-console-core';
//import { HttpClient, HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpParams, HttpResponseBase, HttpEventType } from "@angular/common/http";
//import { Observable, forkJoin } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './ext.component.html',
  styleUrls: ['./ext.component.css']
})
@PluginView("ext",{
  iconName: 'wa-ico-plugins'
})
export class ExtComponent implements OnInit{

  curr_date = new Date();

  toolboxItems = [
    { id: "A", title : "A"},
    { id: "B", title : "B"},
    { id: "C", title : "C"},
    { id: "D", title : "D"},
    { id: "E", title : "E"},
    { id: "F", title : "F"},
    { id: "G", title : "G"},
    { id: "H", title : "H"},
    { id: "I", title : "I"},
    { id: "L", title : "L"},
    { id: "M", title : "M"},
    { id: "N", title : "N"},
    { id: "O", title : "O"},
    { id: "P", title : "P"},
    { id: "Q", title : "Q"},
    { id: "R", title : "R"},
    { id: "S", title : "S"},
    { id: "T", title : "T"}
  ];

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
