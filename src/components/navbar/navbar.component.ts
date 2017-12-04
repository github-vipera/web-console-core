import { Component, OnInit } from '@angular/core';
import {  WebAdminPluginManagerService } from '../../services';
import { Route,Router } from '@angular/router'
@Component({
  selector: 'navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    constructor(){
        console.log("create navbar");
    }
}