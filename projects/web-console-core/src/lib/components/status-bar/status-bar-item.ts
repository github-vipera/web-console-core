import { Type } from '@angular/core';

export class StatusBarItem {
  constructor(public id:string, public component: Type<any>, public data: any) {}
}
