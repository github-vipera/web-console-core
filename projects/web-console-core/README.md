## Web Console Core ##


### Querying Data ### 

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
    resolve(queryResponse.data);
},reject);
```