import { Component, Input, OnInit, OnDestroy  } from '@angular/core';
import { StatusBarItemComponent }      from '../status-bar-item.component';

@Component({
  styleUrls: [
    './status-bar-progress.scss'
  ],
  template: `
    <div class="spinner"></div>
  `
})
export class MainStatusBarProgressComponent implements StatusBarItemComponent {
  @Input() data: any;

  constructor(){
  }
}
