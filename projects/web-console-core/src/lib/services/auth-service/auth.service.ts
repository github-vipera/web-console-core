import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable} from "rxjs";
import {tap} from 'rxjs/operators'
import { MotifConnectorService } from "../motif-connector/motif-connector.service";

export const TOKEN_NOT_AVAILABLE:string = "TOKEN_NOT_AVAILABLE";
export const LOGIN_PATH:string = '/rest/auth/';

const AUTH_TOKEN_KEY:string = "AuthToken"

@Injectable({
    providedIn: 'root'
})
export class AuthService implements HttpInterceptor{
    constructor(private motifConnector:MotifConnectorService){
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
        return next.handle(request).pipe(tap((res:any) => {
            if(res instanceof HttpErrorResponse){
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
        const params = {
            username: request.userName, 
            password: request.password,
            client_id: "123456789",
            client_secret: "123456789",
            grantType:"password",
            scope:""
        };
        
        return this.motifConnector.post(LOGIN_PATH,request,{params:params}).pipe(tap((resp) => {
            if(resp instanceof HttpResponse){
                if(resp.status > 200 && resp.status < 210){
                    console.log(resp);
                }else{
                    console.error(resp);
                }
            }
        }));
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
