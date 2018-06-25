import { Component, OnInit } from '@angular/core';
import { PluginView } from 'web-console-core';
@Component({
  selector: 'app-root',
  templateUrl: './ext.component.html',
  styleUrls: ['./ext.component.css']
})
@PluginView("ext")
export class ExtComponent implements OnInit{
  title = 'app';
  constructor(){
    console.log("ExtComponent constructor")
  }
  ngOnInit(){
    /*let instance:PluginRegistry = PluginRegistry.getInstance();
    console.log("instance: ",instance);
    let cfg = this.srv.getInitialConfig();
    console.log("cfg: ",cfg);*/
  }
}
