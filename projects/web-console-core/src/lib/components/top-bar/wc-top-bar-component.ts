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

  private _locationValue:string;

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
  }

  private loadItems(): void {
    this.logger.debug(LOG_TAG, 'loadItems called.', this.locationValue, this.location);
    const viewContainerRef = this.tbHost.viewContainerRef;
    viewContainerRef.clear();
    const items:WCTopBarItem[] = this.topBarService.getItems(this.location);
    if (items.length==0){
      return;
    }
    this.logger.debug(LOG_TAG, 'loadedItems: ', items, this.locationValue, this.location);
    for (let i = 0 ; i < items.length; i++) {
      this.addItem(items[i]);
    }
  }

  private addItem(item: WCTopBarItem): void {
    this.logger.debug(LOG_TAG, 'addItem for:', this.tbHost, this.locationValue);
    const viewContainerRef = this.tbHost.viewContainerRef;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.logger.debug(LOG_TAG, 'addItem done for:', this.tbHost, this.locationValue);
  }

  public get location():WCTopBarLocation {
    this.logger.debug(LOG_TAG, 'location called:', this.locationValue);
    if (this.locationValue.toLowerCase() === "right"){
      return WCTopBarLocation.Right;
    } else if (this.locationValue.toLowerCase() === "left"){
      return WCTopBarLocation.Left;
    } else if (this.locationValue.toLowerCase() === "center"){
      return WCTopBarLocation.Center;
    } else {
      //fallback
      this.logger.warn(LOG_TAG, 'location fallback used for ', this, this.locationValue);
      return WCTopBarLocation.Unknown;
    }
  }

  @Input()
  public set locationValue(value:string){
    this.logger.debug(LOG_TAG, 'set location called:', value);
    this._locationValue = value;
    this.loadItems();
  }

  public get locationValue():string {
    return this._locationValue;
  }

}
