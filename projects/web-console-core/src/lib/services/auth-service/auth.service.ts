import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient, HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpParams, HttpResponseBase, HttpEventType } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject} from "rxjs";
import {tap, catchError, switchMap, finalize, filter, take, map} from 'rxjs/operators'
import { WebConsoleConfig } from "../../config/WebConsoleConfig";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const TOKEN_NOT_AVAILABLE:string = "TOKEN_NOT_AVAILABLE";
export const LOGIN_PATH:string = '/oauth2/token';

const AUTH_TOKEN_KEY:string = "AuthToken"
const AUTH_LOGON_INFO:string = "LogonInfo"

import { WC_OAUTH_BASE_PATH, COLLECTION_FORMATS }                     from '../../variables';

export interface LogonInfo {
  userName: string;
  accessTime: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService implements HttpInterceptor{

    private clientId:string = "123456789";
    private clientSecret:string = "123456789";
    private _basePath:string = '';
    private _isRefreshingToken = false;
    private tokenAwaiter: BehaviorSubject<TokenData> = new BehaviorSubject<TokenData>(null);
    private _currentUserName: string;

    constructor(protected httpClient: HttpClient,
                @Optional()@Inject(WC_OAUTH_BASE_PATH) basePath: string,
                private webConsoleConfig:WebConsoleConfig,
                @Optional()private router: Router){
                    this._basePath = basePath;
                    console.log("AuthService basePath:", this._basePath)
    }

    public setTokenData(refreshToken:string, accessToken:string, expiresIn:number):TokenData{
        let data = this.createTokenData(refreshToken, accessToken, expiresIn);
        localStorage.setItem(AUTH_TOKEN_KEY,JSON.stringify(data));
        return data;
    }

    public getTokenData():TokenData {
        let data:TokenData = JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY));
        return data;
    }

    public getRefreshToken():string{
        let data:TokenData = this.getTokenData();
        return data != null ? data.refreshToken : null;
    }

    public getAccessToken():string{
        let data:TokenData = this.getTokenData();
        return data != null ? data.accessToken : null;
    }


    private injectAccessToken(request:HttpRequest<any>):HttpRequest<any> {
        let token = this.getAccessToken();
        if(token){
            return request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return request;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        console.log("intercept request");
        request = this.injectAccessToken(request);

        return next.handle(request).pipe(
            catchError((error:any) => {
                if (error instanceof HttpErrorResponse) {
                    let errorBody:any = error.error;
                    if (error.status == 401 &&
                        errorBody.code == "E:V_OAUTH2_INVALID_TOKEN" &&
                        errorBody.details.startsWith("E:V_OAUTH2_EXPIRED_TOKEN")) {
                        return this.handleUnauthorized(request, next);
                    }
                }
                return throwError(error);
            }));
    }

    handleUnauthorized(request: HttpRequest<any>, next: HttpHandler) {
        if (!this._isRefreshingToken) {
            this._isRefreshingToken = true;

            this.tokenAwaiter.next(null);

            return this.refreshToken(next).pipe(
                switchMap((newToken: TokenData) => {
                    if (newToken) {
                        this.tokenAwaiter.next(newToken);
                        return next.handle(this.injectAccessToken(request));
                    }
                    this.invalidateToken();
                    this.notifyUnauthorized();
                }),
                catchError(error => {
                    this.invalidateToken();
                    this.notifyUnauthorized();
                    return throwError(error);
                }),
                finalize(() => {
                    this._isRefreshingToken = false;
                }));
        } else {
            // enqueue request
            return this.tokenAwaiter.pipe(
                filter(token => token != null),
                take(1), // emit only the first
                switchMap(token => {
                    return next.handle(this.injectAccessToken(request));
                }));
        }
    }

    refreshToken(next: HttpHandler): Observable<TokenData> {
        return next.handle(this.createRefreshTokenRequest()).pipe(
            filter((event: HttpEvent<any>) => event.type == HttpEventType.Response),
            map((event: HttpResponse<any>) => {
                return this.extractTokenDataFromEvent(event);
            }), catchError((err) => {
                console.error("Refresh token failed");
                return throwError(err);
            }));
    }

    createRefreshTokenRequest(): HttpRequest<any> {
        let httpParams = new HttpParams()
            .append("client_id", this.clientId)
            .append("client_secret", this.clientSecret)
            .append("refresh_token", this.getRefreshToken())
            .append("grant_type", "refresh_token");

        let postUrl = `${this._basePath}${LOGIN_PATH}`;
        console.log("AuthService refreshToken URL: >" + postUrl + "< ", ">" + this._basePath + "<")
        return new HttpRequest("POST", postUrl, httpParams);
    }

    invalidateToken(){
        localStorage.removeItem(AUTH_TOKEN_KEY)
    }

    public login(request:LoginRequest):Observable<any>{
        let httpParams = new HttpParams()
            .append("username", request.userName)
            .append("password", request.password)
            .append("client_id", this.clientId)
            .append("client_secret", this.clientSecret)
            .append("grant_type", "password");

        let postUrl = `${this._basePath}${LOGIN_PATH}`;
        console.log("AuthService login URL: >" + postUrl+"< ", ">" + this._basePath+"<")
        return this.httpClient.post(postUrl,httpParams).pipe(
            tap((resp) => {
                console.log("AuthService login response: ",resp);
                this.storeLogonInfo(request.userName);
                let accessToken = resp.access_token;
                let refreshToken = resp.refresh_token;
                let expiresIn = resp.expires_in;
                this.setTokenData(refreshToken, accessToken, expiresIn);
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
        this.clearLogonInfo();
      }

      private storeLogonInfo(userName: string) {
          const logonInfo: LogonInfo = {
            userName: userName,
            accessTime: new Date()
          }
          localStorage.setItem(AUTH_LOGON_INFO, JSON.stringify(logonInfo));
      }

      private clearLogonInfo() {
         localStorage.removeItem(AUTH_LOGON_INFO);
      }

      public get logonInfo(): LogonInfo {
        const rawData = localStorage.getItem(AUTH_LOGON_INFO);
        if (rawData){
          return JSON.parse(rawData);
        } else {
          return null;
        }
      }

      public get currentUserName(): string {
        const logonInfo = this.logonInfo;
        if (logonInfo){
          return logonInfo.userName;
        } else {
          return null;
        }
      }

    createTokenData(refreshToken:string, accessToken:string, expiresIn:number): TokenData {
        return {
            refreshToken:refreshToken,
            accessToken:accessToken,
            timestamp: Date.now(),
            expiresIn: expiresIn
        }
    }

    extractTokenDataFromEvent(response: HttpResponse<any>):TokenData {
        let body = response.body;
        return this.setTokenData(body.refresh_token, body.access_token, body.expiresIn);
    }

    notifyUnauthorized(): void {
        if (this.router){
            this.router.navigate([this.webConsoleConfig.loginRoute]);
        }
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
        return this.getTokenData() ? true : false;
    }



}

export interface TokenData {
    refreshToken:string,
    accessToken:string,
    timestamp:number,
    expiresIn:number
}

export interface LoginRequest{
    userName?:string,
    password?:string,
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
