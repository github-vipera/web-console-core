import { WCTopBarService } from './wc-top-bar-service';
import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, ViewChild, NgZone, ComponentFactoryResolver } from '@angular/core';
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

  @ViewChild(WCTopBarContentDirective) tbHost: WCTopBarContentDirective;

  constructor(private elementRef:ElementRef,
    private _ngZone:NgZone,
    private logger: NGXLogger,
    private componentFactoryResolver: ComponentFactoryResolver,
    private topBarService: WCTopBarService){}

  ngOnInit(){
    this.logger.debug(LOG_TAG, "Initializing...")
    this.topBarService.getStructureChange().subscribe(items => { this.loadItems(); });
    this.loadItems();
  }

  ngOnDestroy(){}

  ngAfterViewInit(){}

  private loadItems(): void {
    this.logger.debug(LOG_TAG, 'loadItems called.');
    const items:WCTopBarItem[] = this.topBarService.getItems();
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

}
