import { Directive, OnInit, OnDestroy, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ACLService } from './acl.service';
import { NGXLogger } from 'ngx-logger';

@Directive({
    selector: '[aclPermissionOneOf],[aclPermission]'
  })
export class ACLPermissionDirective implements OnInit, OnDestroy {

    private _aclPermission: string | string[];
    private _allRequired: boolean = true;

    constructor(private logger: NGXLogger,
        private aclService:ACLService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef) {
            this.logger.debug("ACLPermissionDirective", "ctor", aclService)
    }
  
    ngOnInit(): void {
        this.logger.debug("ACLPermissionDirective", "init")
        this.updateView();
    }
  
    ngOnDestroy(): void {
    }

    @Input("aclPermissionOneOf")
    set setAclPermissionOneOf(value:string|string[]){
        this.logger.debug("ACLPermissionDirective", "Setting oneOf permission for ", value)
        this.setAclPermissionImpl(value);
        this._allRequired = false;
    }

    @Input("aclPermission")
    set setAclPermission(value:string|string[]){
        this.logger.debug("ACLPermissionDirective", "Setting permission for ", value)
        this.setAclPermissionImpl(value);
        this._allRequired = true;
    }


    private setAclPermissionImpl(value:string|string[]):void{
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
        let checkResult = this.aclService.can(this._aclPermission, this._allRequired);
        return checkResult;
    }

}
