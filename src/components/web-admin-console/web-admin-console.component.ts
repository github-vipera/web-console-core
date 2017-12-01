import { Component, OnInit } from '@angular/core';
import {  WebAdminPluginManagerService } from '../../services';
import { Route,Router } from '@angular/router'
@Component({
  selector: 'web-admin-console',
  styleUrls: ['./web-admin-console.component.scss'],
  templateUrl: './web-admin-console.component.html',
})
export class WebAdminConsoleComponent implements OnInit {
  routes:Array<Route> = [];
  public constructor(private pluginManager:WebAdminPluginManagerService,private router: Router) {
  }

  /**
   * Implements onInit event handler.
   */
  public ngOnInit(): void {
    console.log("WebAdminConsoleComponent init done");
    //this.routes = this.pluginManager.createRouteConfigFromCatalog();
    this.pluginManager.createRouteConfigFromCatalog().then((result:Array<Route>) => {
      this.routes = result;
      this.router.resetConfig(this.routes);
      console.log("WebAdminConsoleComponent routes",this.routes);
    },(err) => {
      console.error("Fail to crete routing:",err);
    }).catch((err) => {
      console.error("Catch fail to crete routing:",err);
    });
    //console.log("WebAdminConsoleComponent routes",this.routes);
    //this.router.resetConfig(this.routes);
  }
  
  
}