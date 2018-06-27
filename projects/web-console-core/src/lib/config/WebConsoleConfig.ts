export class WebConsoleConfig{
    loginRoute:string;
    constructor(loginRoute:string){
        this.loginRoute = loginRoute;
    }
    
    public static create(loginRoute:string){
        return new WebConsoleConfig(loginRoute);
    }
}