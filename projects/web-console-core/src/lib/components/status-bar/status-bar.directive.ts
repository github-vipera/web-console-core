import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[status-bar-host]',
})
export class StatusBarDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

