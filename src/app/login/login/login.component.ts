import { Component, OnInit } from '@angular/core';
import { NavigationService, AuthService } from 'web-console-core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private navService:NavigationService,private authService:AuthService) { 
      
  }

  ngOnInit() {}

  doLogin(){
    this.authService.login({userName:"admin",password:"admin"}).subscribe(() => {
      console.log("done");
    },(err) => {
      console.error("fail",err);
    });
  }

}
