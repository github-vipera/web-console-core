# Web Console UI Kit



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



## Querying Data ##

#### Paging Queries ####
The querying of the MOTIF queries it is performed thanks to an Http Interceptor mechanism. 

In a paged query, the data is returned in blocks of fixed length (*page_size*).  A resultset can therefore consist of a number of pages equal to *numer_of_total_records / page_size*.

When we ask MOTIF to have paginated data, it must be done by specifying the page you want (*page_index*) and the max number of rows in a page (*page_size*). It will reply with the data and the total number of pages available. In this way you will be able to build a paging UI.

**Attention**: pagination is not available for all APIs, but only those that can return a quantity of data that can be paged.



To execute a paged query, you need to pass an object of type `MotifPagedQuery` to the call that implements it.

This is an example of paged query:

```typescript

let pagedQuery:MotifPagedQuery = new MotifPagedQuery();
pagedQuery.pageIndex = 1;
pagedQuery.pageSize = 15;

let sort:MotifQuerySort = ....; 
pagedQuery.sort = sort;

let filter:MotifQueryFilter = ....;
pagedQuery.filter = filter;

this.usersService.getUsersList("Default", "response", false, pagedQuery).subscribe((response)=>{

        let results:MotifQueryResults = MotifQueryResults.fromHttpResponse(response);

    	this.usersList = results.data;
        this.totalPages = results.totalPages;
        this.totalRecords = results.totalRecords;
        this.currentPage = results.pageIndex;
        this.gridView = {
          data: this.usersList,
          total: results.totalRecords
        }
        this.currentPage = results.pageIndex;

 }, error=>{
    console.log("test query error: ", error);
});
```

As you can see from the example, the call returns an HttpResponse object and not directly a list of User as you would expect.

In this case you can easily transform the Response into an object of type `MotifQueryResults` by executing the static `fromHttpResponse`.

The `MotifQueryRestults` object contains all the necessary information about the oagination and the paginated data returned.



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



## Status Bar Service

The StatusBarService allows you to manage the status bar of the web console. It lets you display an information text in the default area, show a busy indicator or add and remove custom items.

To use the service just import it as follows:

```typescript
import { StatusBarService } from 'web-console-core'

constructor(private statusBarService:StatusBarService) {
}

```

To change the text displayed in the statusbar just call the ***setStatus*** method:

```typescript
    this.statusBarService.setStatus("Hello Console!");
```

To show the busy indicator you simply need to call the ***setBusyIndicatorVisible*** method:

```typescript
      this.statusBarService.setBusyIndicatorVisibile(true);
```

and at the end of your process call the show again to dismiss it:

```typescript
      this.statusBarService.setBusyIndicatorVisibile(false);
```

### 

## Custom Status Bar Item

If you want you can add custom elements to the Status Bar. To do this just create a component that implements ***StatusBarItemComponent*** and add it with a unique ID through the ***StatusBarService*** service.

Here is an example:


This is the item component:
```typescript

import { Component, Input } from '@angular/core';
import { StatusBarItemComponent }      from 'web-console-core';
import { timer } from 'rxjs';

@Component({
  styleUrls: [
    './test.scss'
  ],
  template: `
    <div style="display:flex;margin-right:24px;">
      <div class="info license">
        {{dateTime  | date:'h:mm.ss a' }}
      </div>
      <div class="license">ViperaOSGI • ver. 1.10 • Issued 02.25.2016 • <b class="warn">Expires 12.31.2018</b></div>
    </div>
  `
})
export class MyCustomStatusBarItemComponent implements StatusBarItemComponent {
  @Input() data: any;
  dateTime:Date = new Date;

  constructor(){
    timer(0, 1000).subscribe(x=>{
      this.dateTime = new Date();
    });
  }
}
```

And this is the registration on StatusBarService:
```typescript
    this.statusBarService.addItem(new StatusBarItem("mycustom-sb-item", MyCustomStatusBarItemComponent, {}));
```

