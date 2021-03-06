import { Component, OnInit, ViewChild } from '@angular/core';
import { Route,Router } from '@angular/router'
import { NavigationService } from '../../services/navigation-service/navigation.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { WebConsolePluginManagerService, ActivablePlugin } from '../../services/web-console-plugin-manager/web-console-plugin-manager.service';
import { MainStatusBarItemComponent } from '../status-bar/core-items/status-bar-default-text'
import { MainStatusBarProgressComponent } from '../status-bar/core-items/status-bar-progress'
import { StatusBarService } from '../status-bar/status-bar.service'
import { StatusBarItem } from '../status-bar/status-bar-item'
import { WCMainMenuComponent } from '../main-menu/main-menu.component'
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { EventBusService } from '../../services/event-bus/event-bus-service';

const LOG_TAG = "[WebConsoleComponent]"

@Component({
  selector: 'web-console',
  styleUrls: ['./web-console.component.scss'],
  templateUrl: './web-console.component.html'
})
export class WebConsoleComponent implements OnInit {

  //plugins:Array<ActivablePlugin>
  plugins:Observable<Array<ActivablePlugin>>;


  private _currentItemSelected:string;

  @ViewChild(WCMainMenuComponent) mainMenu:WCMainMenuComponent;


  errorBox:{
    show:boolean,
    message:string
  };

  public constructor(private router: Router,
    private authService: AuthService,
    private navService: NavigationService,
    private pluginManager: WebConsolePluginManagerService,
    private statusBarService: StatusBarService,
    private eventBus: EventBusService,
    private logger: NGXLogger) {
    this.logger.debug("Web Console component constructor");
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
    this.logger.debug(LOG_TAG, "WebConsoleComponent init done **");

    let dashboardRoute:Route = this.navService.getDashboardRoute();
    this.plugins = this.pluginManager.getCurrentActivablePlugins(dashboardRoute);

    //initialize the status bar
    this.initStatusBar();

    // Listen on AuthService:LoginEvent to invalidate plugins cache
    this.eventBus.on('AuthService:LoginEvent').subscribe((message) => {
      this.logger.debug(LOG_TAG, "on AuthService:LoginEvent received");
      this.pluginManager.invalidateActivePluginsCache();
    });

  }

  private initStatusBar(){
    this.statusBarService.addItem(new StatusBarItem("__$wcstatusbar-main-status", MainStatusBarItemComponent, {}));
    this.statusBarService.addItem(new StatusBarItem("__$wcstatusbar-main-progress-status", MainStatusBarProgressComponent, {}));
  }

  private activatePlugin(plugin:ActivablePlugin){
    this.logger.debug(LOG_TAG, "activate plugin",plugin);
  }

  private validateCurrentRoute():void{
    let url = this.router.routerState.snapshot.url;
    this.logger.debug(LOG_TAG, "active", "" +this.router.isActive(url,true));
    if(url){
      this.router.navigateByUrl(url).then((res:boolean) => {
        this.logger.debug(LOG_TAG, "navigateByUrl:",res)
      },(err) => {
         this.logger.error(LOG_TAG, "navigateByUrl err",err);
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

  onMainMenuClicked(menuId:string){
    this.authService.logout();
  }

  showMainMenu(){
    this.mainMenu.show();
  }

  onMenuItemClick(event, currentItem) {
    if (this._currentItemSelected) {
        this.setCurrent(this._currentItemSelected, false);
    }

    this._currentItemSelected = currentItem;
    this.setCurrent(currentItem, true);
  }

  private setCurrent(itemId:string, selected:boolean){
    let el:HTMLElement = document.getElementById(itemId);
    if (el){
      if (selected){
        el.classList.add("current");
      } else {
        el.classList.remove("current");
      }
    }
  }

}


