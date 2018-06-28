import { Component, OnInit } from '@angular/core';
import { AuthService } from 'web-console-core';
import { NavigationService } from 'web-console-core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  constructor(private srv:AuthService,private navService:NavigationService){

  }
  ngOnInit(){
    /*let instance:PluginRegistry = PluginRegistry.getInstance();
    console.log("instance: ",instance);
    let cfg = this.srv.getInitialConfig();
    console.log("cfg: ",cfg);*/
  }

  onClick(){
    console.log("onClick");
    this.srv.login({userName:"admin",password:"admin123"}).subscribe((data) => {
      console.log("Done",data);
    });
  }
}
