import { Component, OnInit } from '@angular/core';
import { Route,Router } from '@angular/router'
import { NavigationService } from '../../services/navigation-service/navigation.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { WebConsolePluginManagerService, ActivablePlugin } from '../../services/web-console-plugin-manager/web-console-plugin-manager.service';
import { MainStatusBarItemComponent } from '../status-bar/core-items/status-bar-default-text'
import { StatusBarService } from '../status-bar/status-bar.service'
import { StatusBarItem } from '../status-bar/status-bar-item'

@Component({
  selector: 'web-console',
  styleUrls: ['./web-console.component.scss'],
  templateUrl: './web-console.component.html'
})
export class WebConsoleComponent implements OnInit {
  //routes:Array<Route> = [];
  
  plugins:Array<ActivablePlugin>
  
  errorBox:{
    show:boolean,
    message:string
  };

  public constructor(private router: Router, 
    private authService:AuthService ,
    private navService:NavigationService, 
    private pluginManager:WebConsolePluginManagerService,
    private statusBarService:StatusBarService) {
    console.log("Web Console component constructor");
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
    console.log("WebConsoleComponent init done");
    //this.initStaticRouting();
    this.createRoutingConfigByMotifCatalog();

    //initialize the status bar
    this.initStatusBar();

  }

  private initStatusBar(){
    this.statusBarService.addItem(new StatusBarItem("__$wcstatusbar-main-status", MainStatusBarItemComponent, {}));
  }

  private createRoutingConfigByMotifCatalog(){
    this.loadPluginList();
    this.navService.createRouteConfigFromCatalog().then((result:Array<Route>) => {
      this.resetRouting(result);
      this.loadPluginList();
      console.log("WebConsoleComponent routes",result);
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


