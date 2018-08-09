import { Component, Input, OnInit, OnDestroy  } from '@angular/core';
import { StatusBarItemComponent }      from '../status-bar-item.component';
import { StatusBarService } from '../status-bar.service'

@Component({
  styleUrls: [
    './status-bar-progress.scss'
  ],
  template: `
    <div  [hidden]="!isVisible" class="spinner"></div>
  `
})
export class MainStatusBarProgressComponent implements StatusBarItemComponent {
  @Input() data: any;
  
  public isVisible:boolean=false;

  constructor(private sbService:StatusBarService){
  }

  ngOnInit() {
    this.sbService.isBusyIndicatorVisible().subscribe(isVisible => { this.isVisible = isVisible; })
  }
  
  ngOnDestroy(){
  }


}
