# WebConsoleCoreApp

## Logger Service

First you need to import the Logger Module into your App Module root in this way:

```typescript
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'
@NgModule({
  declarations: [
    AppComponent 
  ],
  imports: [
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.TRACE, serverLogLevel: NgxLoggerLevel.OFF})
  ]
})
export class AppModule { 

  constructor(private logger: NGXLogger){
    this.logger.info("AppModule" ,"Starting application");
  }

}
```
*(app.module.ts)*


Into your classes you need to import the NGXLogger:

```typescript
import { NGXLogger } from 'web-console-core';
```

and use it:

```typescript
this.logger.debug("MotifQueryService","constructor");
```

### Querying Data ### 

#### Paging Queries ####
This is an example of paged query:

```typescript
const USERS_LIST_ENDPOINT =  "/rest/v2/platform/domains/{0}/users"

let domain = "Default";
let endpoint = String.Format(USERS_LIST_ENDPOINT, domain);
let pageIndex = 1;
let pageSize = 2;

let sort = new MotifQuerySort();
sort.orderAscendingBy("username").orderDescendingBy("last_login");

let filter =  new MotifQueryFilter();
filter.equals("username", "john_doe").greaterThan("register_date", "1-1-2018").between("logins", 10,20);

this.motifQueryService.query(endpoint, pageIndex, pageSize, sort, filter).subscribe((queryResponse) => {
    console.log("Get Users List done: ",queryResponse);
},reject);
```