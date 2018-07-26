import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { StatusBarItem }      from './status-bar-item';
import { StatusBarDirective } from './status-bar.directive';
import { StatusBarItemComponent } from './status-bar-item.component';
import { StatusBarService } from '../../services/status-bar-service/status-bar.service'

@Component({
  selector: 'app-status-bar',
  template: `
              <div class="app-startus-bar">
                <h3>Qui c'è la statusbar:</h3>
                <ng-template status-bar-host></ng-template>
              </div>
            `
})
export class StatusBarComponent implements OnInit, OnDestroy {

    @Input() items:StatusBarItem[];

    @ViewChild(StatusBarDirective) statusBarHost: StatusBarDirective;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private statusBarService:StatusBarService) { }

    ngOnInit() {
        this.loadComponents();
        //this.loadComponent();
        //this.getAds();
    }
    
    ngOnDestroy() {
    }

    private loadComponents(){
        this.items = this.statusBarService.getItems();

        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.items[0].component);
        let viewContainerRef = this.statusBarHost.viewContainerRef;
        viewContainerRef.clear();
    
        let componentRef = viewContainerRef.createComponent(componentFactory);

    }

}