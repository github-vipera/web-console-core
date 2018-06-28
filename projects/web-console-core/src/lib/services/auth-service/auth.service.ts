import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpParams } from "@angular/common/http";
import { Observable} from "rxjs";
import {tap} from 'rxjs/operators'
import { MotifConnectorService } from "../motif-connector/motif-connector.service";
import { WebConsoleConfig } from "../../config/WebConsoleConfig";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const TOKEN_NOT_AVAILABLE:string = "TOKEN_NOT_AVAILABLE";
export const LOGIN_PATH:string = '/oauth2/token';

const AUTH_TOKEN_KEY:string = "AuthToken"

@Injectable({
    providedIn: 'root'
})
export class AuthService implements HttpInterceptor{
    constructor(private motifConnector:MotifConnectorService, private webConsoleConfig:WebConsoleConfig, private router: Router){
    }

    public setToken(value:string):void{
        let data=this.createTokenData(value);
        localStorage.setItem(AUTH_TOKEN_KEY,JSON.stringify(data))   
    }

    public getToken():string{
        let data:TokenData = JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY));
        return data != null ? data.token : null;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        console.log("intercept request");
        let token = this.getToken();
        if(token){
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request).pipe(tap(() => {
            console.log("Interceptor req done");
        },(res:any) => {
            if(res instanceof HttpResponse){
                if(res.status === 401){
                    this.invalidateToken();
                    this.notifyUnauthorized();
                }
            }
        }))
    }

    invalidateToken(){
        localStorage.removeItem(AUTH_TOKEN_KEY)
    }

    public login(request:LoginRequest):Observable<any>{
        let httpParams = new HttpParams()
            .append("username", request.userName)
            .append("password", request.password)
            .append("client_id", "123456789")
            .append("client_secret", "123456789")
            .append("grant_type", "password");
        
        return this.motifConnector.post(LOGIN_PATH,httpParams).pipe(
            tap((resp) => {
                console.log("login",resp)
                let token = resp.access_token;
                let refreshToken = resp.refresh_token;
                this.setToken(token);
                this.onAuthorizationSuccess();
            },(err) => {
                console.log("login error",err);
            }
        ));
    }


    createTokenData(value:string): TokenData{
        let millis = Date.now();
        return {
            token:value,
            timestamp: millis
        }
    }

    notifyUnauthorized(): void {
        console.error("Unauthorized")
    }

    onAuthorizationSuccess():void {
        //called by the login/auth form module
        //TODO!! redirecto to web console route
        this.router.navigate([this.webConsoleConfig.dashboardRoute]);
    }

    onAuthorizationFailure():void {
        //called by the login/auth form module
        this.router.navigate([this.webConsoleConfig.loginRoute]);
    }

    isAuthenticated():boolean {
        return this.getToken()? true:false;
    }
}

export interface TokenData {
    token:string
    timestamp:number
}

export interface LoginRequest{
    userName?:string,
    password?:string
    [propName: string]: string
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router, private authService:AuthService, private webConsoleConfig:WebConsoleConfig) { 

    }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        if (this.authService.isAuthenticated()){
            return true;
        }
 
        // not logged in so redirect to login page with the return url
        this.router.navigate([this.webConsoleConfig.loginRoute]);
        return false;
    }
}