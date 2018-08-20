import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient, HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpParams } from "@angular/common/http";
import { Observable} from "rxjs";
import {tap} from 'rxjs/operators'
import { MotifConnectorService } from "../motif-connector/motif-connector.service";
import { WebConsoleConfig } from "../../config/WebConsoleConfig";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const TOKEN_NOT_AVAILABLE:string = "TOKEN_NOT_AVAILABLE";
export const LOGIN_PATH:string = '/oauth2/token';

const AUTH_TOKEN_KEY:string = "AuthToken"

import { WC_OAUTH_BASE_PATH, COLLECTION_FORMATS }                     from '../../variables';


@Injectable({
    providedIn: 'root'
})
export class AuthService implements HttpInterceptor{

    private _basePath:string = '';

    constructor(protected httpClient: HttpClient, 
                @Optional()@Inject(WC_OAUTH_BASE_PATH) basePath: string, 
                private webConsoleConfig:WebConsoleConfig, 
                @Optional()private router: Router){
                    this._basePath = basePath;
                    console.log("AuthService basePath:", this._basePath)
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
        
        let postUrl = `${this._basePath}${LOGIN_PATH}`;
        console.log("AuthService login URL: >" + postUrl+"< ", ">" + this._basePath+"<")
        return this.httpClient.post(postUrl,httpParams).pipe(
            tap((resp) => {
                console.log("AuthService login response: ",resp)
                let token = resp.access_token;
                let refreshToken = resp.refresh_token;
                this.setToken(token);
                this.onAuthorizationSuccess();
                console.log("AuthService login done.")
            },(err) => {
                console.error("login error",err);
            }
        ));
    }

    logout(){
        this.invalidateToken();
        if (this.router){
            this.router.navigate([this.webConsoleConfig.loginRoute]);
        }
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
        if (this.router){
            this.router.navigate([this.webConsoleConfig.dashboardRoute]);
        }
    }

    onAuthorizationFailure():void {
        if (this.router){
            this.router.navigate([this.webConsoleConfig.loginRoute]);
        }
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