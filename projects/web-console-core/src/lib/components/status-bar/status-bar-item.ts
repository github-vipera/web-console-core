import { Type } from '@angular/core';

export class StatusBarItem {
  constructor(public component: Type<any>, public data: any) {}
}

