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
    this.routes = this.pluginManager.createRouteConfigFromCatalog();
    console.log("WebAdminConsoleComponent routes",this.routes);
    this.router.resetConfig(this.routes);
  }
  
  
}