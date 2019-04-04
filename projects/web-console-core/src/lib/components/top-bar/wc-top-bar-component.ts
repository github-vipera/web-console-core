import { WCTopBarService, WCTopBarLocation, StructureChangedEvent } from './wc-top-bar-service';
import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, ViewChild, NgZone, ComponentFactoryResolver, Input } from '@angular/core';
import { WCTopBarContentDirective } from './wc-top-bar-content-directive';
import { NGXLogger } from 'ngx-logger';
import { WCTopBarItem } from './wc-top-bar-item';

const LOG_TAG = '[WCTopBarComponent]';

@Component({
  selector: 'wc-top-bar',
  templateUrl: './wc-top-bar-component.html',
  styleUrls: [ './wc-top-bar-component.scss' ]
})
export class WCTopBarComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() public locationValue:string = "right";

//  @Input() public location:WCTopBarLocation = WCTopBarLocation.Right;

  @ViewChild(WCTopBarContentDirective) tbHost: WCTopBarContentDirective;

  constructor(private elementRef:ElementRef,
    private _ngZone:NgZone,
    private logger: NGXLogger,
    private componentFactoryResolver: ComponentFactoryResolver,
    private topBarService: WCTopBarService){}

  ngOnInit(){
    this.logger.debug(LOG_TAG, "Initializing...", this.locationValue)
    this.topBarService.getStructureChange().subscribe( (event:StructureChangedEvent) => {
      this.logger.debug(LOG_TAG, 'StructureChangedEvent for:', event, this);
      this.loadItems();
    });
  }

  ngOnDestroy(){}

  ngAfterViewInit(){
    this.loadItems();
  }

  private loadItems(): void {
    this.logger.debug(LOG_TAG, 'loadItems called.');
    const items:WCTopBarItem[] = this.topBarService.getItems(this.location);
    this.logger.debug(LOG_TAG, 'loadedItems', items);
    for (let i = 0 ; i < items.length; i++) {
      this.addItem(items[i]);
    }
  }

  private addItem(item: WCTopBarItem): void {
    this.logger.debug(LOG_TAG, 'addItem for:', this.tbHost);
    const viewContainerRef = this.tbHost.viewContainerRef;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.logger.debug(LOG_TAG, 'addItem done for:', this.tbHost);
  }

  public get location():WCTopBarLocation {
    this.logger.debug(LOG_TAG, 'location called:', this.locationValue);
    if (this.locationValue.toLowerCase() === "right"){
      return WCTopBarLocation.Right;
    } else if (this.locationValue.toLowerCase() === "left"){
      return WCTopBarLocation.Left;
    } else {
      //fallback
      return WCTopBarLocation.Right;
    }
  }

}
