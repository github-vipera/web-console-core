import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy, ViewContainerRef } from '@angular/core';
import { StatusBarService } from './status-bar.service';
import { StatusBarItemComponent } from './status-bar-item.component';
import { StatusBarItem } from './status-bar-item';
import { StatusBarDirective } from './status-bar.directive';
import { NGXLogger } from 'ngx-logger';

const LOG_TAG = '[StatusBarComponent]';

@Component({
  styleUrls: ['./status-bar.component.scss'],
  /*
  styles: [`
    :host {
      font-size: .56rem;
      color: #787f84;
      font-family: Montserrat;
      text-transform: uppercase;
      width: 100%;
    },
    .wc-status-bar-container {
      display:flex;
      width: 100%;
    }
  `],*/
  selector: 'wc-status-bar',
  template: `<div class="wc-status-bar-container"><ng-template wc-status-bar-host></ng-template></div>`
})
export class StatusBarComponent implements OnInit, OnDestroy {

    @ViewChild(StatusBarDirective) dcHost: StatusBarDirective;

    constructor(private logger:   NGXLogger,
                private dcService: StatusBarService,
                private viewContainerRef: ViewContainerRef,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
      this.logger.debug(LOG_TAG, 'ngOnInit');
      this.dcService.getStructureChange().subscribe(items => { this.loadItems(); });
      this.loadItems();
    }

    ngOnDestroy() {

    }

    private loadItems(): void {
      this.logger.debug(LOG_TAG, 'loadItems', this.dcHost);
      const viewContainerRef = this.dcHost.viewContainerRef;

      viewContainerRef.clear();

      const items = this.dcService.getItems();

      this.logger.debug(LOG_TAG, 'loadedItems', items);
      for (let i = 0 ; i < items.length; i++) {
        this.addItem(items[i]);
      }

    }

    private addItem(item: StatusBarItem): void {
        this.logger.debug(LOG_TAG, 'addItem', this.dcHost);
        const viewContainerRef = this.dcHost.viewContainerRef;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<StatusBarItemComponent>componentRef.instance).data = item.data;
    }



}
