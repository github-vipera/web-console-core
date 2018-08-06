import { Directive, OnInit, OnDestroy, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ACLService } from './acl.service';
import { NGXLogger } from 'ngx-logger';

@Directive({
    selector:"[aclPermission]"
  })
export class ACLPermissionDirective implements OnInit, OnDestroy {

    private _aclPermission: string | string[];

    constructor(private logger: NGXLogger,
        private aclService:ACLService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef) {
            this.logger.debug("ACLPermissionDirective", "ctor")
    }
  
    ngOnInit(): void {
        this.logger.debug("ACLPermissionDirective", "init")
        this.updateView();
    }
  
    ngOnDestroy(): void {
    }

    @Input("aclPermission")
    set setAclPermission(value:string|string[]){
        this.logger.debug("ACLPermissionDirective", "Setting permission for ", value)
        this._aclPermission = value
    }
  
    private updateView() {
        this.logger.debug("ACLPermissionDirective", "updateView")
        if (this.checkPermission()) {
            this.showTemplateBlockInView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
  
    private showTemplateBlockInView(template: TemplateRef<any>): void {
        this.logger.debug("ACLPermissionDirective", "showTemplateBlockInView")
        this.viewContainer.clear();
        if (!template) {
            return;
        }
        this.viewContainer.createEmbeddedView(template);
    }
  
    private checkPermission():boolean {
        this.logger.debug("ACLPermissionDirective", "Checking permission for", this._aclPermission)
        if (typeof this._aclPermission==='string'){
            return this.aclService.can(this._aclPermission);
        } else {
            return this.aclService.canAll(this._aclPermission);
        }
    }
  
}
