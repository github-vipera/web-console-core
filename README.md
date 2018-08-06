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

## Acl Service (User Permissions)

The AclService allows you to manage the permissions on the elements of the web console. For example, if a user can not create users, it will not even be able to see the "add user" button.
For this reason the AclService is able to return if a specific recorded action is available for the logged in user.

For a more convenient integration within HTML templates there are two directives that allow you to conditionally display DOM elements in relation to ACL permissions:


| Directive          | Input           | Description |
|--------------------|-----------------|-------------|
| aclPermission      | string or string[] | all permissions specified (one or more) must be granted             |
| aclPermissionOneOf | string or string[] | at least one of the specified permissions must be granted             |

Here an example:

```html
    <ng-template [aclPermission]="['userAdd']">
      <button id='add-user-button' type='button'>Add New User</button>
    </ng-template>
```



