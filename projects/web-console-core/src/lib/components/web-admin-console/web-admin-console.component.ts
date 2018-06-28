import { Component, OnInit } from '@angular/core';
import {  WebAdminPluginManagerService } from '../../services/web-admin-plugin-manager/web-admin-plugin-manager.service';
import { Route,Router } from '@angular/router'
import { NavigationService } from '../../services/navigation-service/navigation.service';
import { PluginRegistry } from '../../commons';
import * as _ from 'lodash';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'web-admin-console',
  styleUrls: ['./web-admin-console.component.scss'],
  templateUrl: './web-admin-console.component.html'
})
export class WebAdminConsoleComponent implements OnInit {
  routes:Array<Route> = [];
  errorBox:{
    show:boolean,
    message:string
  };
  public constructor(private router: Router, private authService:AuthService ,private navService:NavigationService) {
    console.log("console component constructor");
    this.initErrorBox();
  }

  private initErrorBox():void{
    this.errorBox  = {
      show:false,
      message:null
    };
  }

  /**
   * Implements onInit event handler.
   */
  public ngOnInit(): void {
    console.log("WebAdminConsoleComponent init done");
    //this.initStaticRouting();
    this.createRoutingConfigByMotifCatalog();
  }

  private createRoutingConfigByMotifCatalog(){
    this.navService.createRouteConfigFromCatalog().then((result:Array<Route>) => {
      this.routes = result;
      console.log(">>>>>> New route:",this.routes);
      this.router.resetConfig(this.routes);
      console.log("WebAdminConsoleComponent routes",this.routes);
      //this.validateCurrentRoute();
    },(err) => {
      console.error("Fail to crete routing:",err);
      //this.resetRouting([]);
      this.showError("Catalog mapping fail");
      this.validateCurrentRoute();
    }).catch((err) => {
      console.error("Catch fail to crete routing:",err);
      //this.resetRouting([]);
      this.showError("Catalog mapping fail");
      this.validateCurrentRoute();
    });

  }


  private initStaticRouting():void{
    //console.log("initStaticRouting",this.pluginManager.getInitialConfig());
    //this.resetRouting(this.pluginManager.getInitialConfig());
    let routes = this.navService.getInitialRouteConfig()
    console.log("initStaticRouting",routes);
    this.resetRouting(routes);
  }


  private validateCurrentRoute():void{
    let url = this.router.routerState.snapshot.url;
    console.log("active", "" +this.router.isActive(url,true));
    if(url){
      this.router.navigateByUrl(url).then((res:boolean) => {
        console.log("navigateByUrl:",res)
      },(err) => {
         console.error("navigateByUrl err",err);
         this.router.navigateByUrl('/');
      });
    }
  }


  /**
   * Reset routing config
   * @param routes 
   */
  private resetRouting(routes:Array<Route>){
    this.router.resetConfig(routes);
    this.routes = routes;
  }

  private showError(message:string):void{
    this.errorBox.message = message;
    this.errorBox.show = true;
  }

  private hideError():void{
    this.errorBox.show = false;
    this.errorBox.message = null;
  }
  

  doLogout():void{
    this.authService.logout();
  }
  
}