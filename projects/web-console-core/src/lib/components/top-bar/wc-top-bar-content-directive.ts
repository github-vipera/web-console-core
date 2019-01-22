import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[wc-top-bar-content-host]',
})
export class WCTopBarContentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
