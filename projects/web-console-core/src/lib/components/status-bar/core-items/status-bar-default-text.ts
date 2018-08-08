import { Component, Input, OnInit, OnDestroy  } from '@angular/core';
import { StatusBarItemComponent }      from '../status-bar-item.component';
import { StatusBarService } from '../status-bar.service'
import { first } from 'rxjs/operators';

@Component({
  styles: [`
    :host {
      order: 0;
      flex-grow: 1;
    }
  `],
  template: `
    <div>
      {{statusText}}
    </div>
  `
})
export class MainStatusBarItemComponent implements StatusBarItemComponent, OnInit, OnDestroy {
  @Input() data: any;

  @Input() statusText:string;

  constructor(private sbService:StatusBarService){}

  ngOnInit() {
    this.sbService.getStatus().subscribe(statusText => { this.statusText = statusText; })
  }
  ngOnDestroy(){
  }

}   
