import { Type } from '@angular/core';

export class WCTopBarItem {
  constructor(public id: string, public component: Type<any>) {}
}
