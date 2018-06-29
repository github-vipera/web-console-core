import { Component, OnInit } from '@angular/core';
import { Route,Router } from '@angular/router'
import { NavigationService } from '../../services/navigation-service/navigation.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { WebAdminPluginManagerService, ActivablePlugin } from '../../services/web-admin-plugin-manager/web-admin-plugin-manager.service';

@Component({
  selector: 'web-admin-console',
  styleUrls: ['./web-admin-console.component.scss'],
  templateUrl: './web-admin-console.component.html'
})
export class WebAdminConsoleComponent implements OnInit {
  //routes:Array<Route> = [];
  
  plugins:Array<ActivablePlugin>
  
  errorBox:{
    show:boolean,
    message:string
  };

  public constructor(private router: Router, private authService:AuthService ,private navService:NavigationService, private pluginManager:WebAdminPluginManagerService) {
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
    this.loadPluginList();
    this.navService.createRouteConfigFromCatalog().then((result:Array<Route>) => {
      this.resetRouting(result);
      this.loadPluginList();
      console.log("WebAdminConsoleComponent routes",result);
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

  private loadPluginList(){
    console.log("loadPluginList ...")
    this.plugins = this.pluginManager.getCurrentActivablePlugins();
    console.log("loading done: ",this.plugins);
  }

  private activatePlugin(plugin:ActivablePlugin){
    console.log("activate plugin",plugin);
  }

  private validateCurrentRoute():void{
    let url = this.router.routerState.snapshot.url;
    console.log("active", "" +this.router.isActive(url,true));
    if(url){
      this.router.navigateByUrl(url).then((res:boolean) => {
        console.log("navigateByUrl:",res)
      },(err) => {
         console.error("navigateByUrl err",err);
         //this.router.navigateByUrl('/');
         this.navService.goToDashboard();
      });
    }
  }

  /**
   * Reset routing config
   * @param routes 
   */
  private resetRouting(routes:Array<Route>){
    this.router.resetConfig(routes);
    //this.routes = routes;
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


