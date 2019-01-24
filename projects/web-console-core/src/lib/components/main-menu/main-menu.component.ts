import { NGXLogger } from 'ngx-logger';
import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, HostListener, EventEmitter, Input, Output, HostBinding, NgZone } from '@angular/core';


@Component({
  selector: 'wc-main-menu',
  templateUrl: './wc-main-menu.component.html',
  styleUrls: [ './wc-main-menu.component.scss' ]
})
export class WCMainMenuComponent implements OnInit, OnDestroy, AfterViewInit {

    @Output() menuClick: EventEmitter<string> = new EventEmitter<string>();

    constructor(private logger: NGXLogger, private elementRef:ElementRef, private _ngZone:NgZone){}

    @Input()
    public visible:boolean=false;

    ngOnInit(){
      this.logger.debug("WCMainMenuComponent elementRef:",this.elementRef.nativeElement.children[0])
    }

    ngOnDestroy(){}

    ngAfterViewInit(){}

    /*
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (this.visible){
            if(this.elementRef.nativeElement.contains(event.target)) {
                this.logger.debug("WCMainMenuComponent clicked inside:",this.elementRef.nativeElement)
            } else {
                this.hide();
                this.logger.debug("WCMainMenuComponent clicked outside:",this.elementRef.nativeElement)
            }
        }
    }
    */

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.visible){
            this.logger.debug("WCMainMenuComponent key down:",this.elementRef.nativeElement)
            let x = event.keyCode;
            if (x === 27) {
                this.hide();
            }
        }
    }

    public show():void{
        this.visible = true;
        setTimeout(()=>{
            this.elementRef.nativeElement.children[0].focus();
        }, 10)
    }

    public hide():void{
        this.visible = false;
    }

    onMenuClicked(menuItem:string):void{
        this.hide();
        setTimeout(()=>{
            this.menuClick.emit(menuItem);
        });
    }

      onDivFocus(){
      }

      onDivFocusOut(){
      }

      onComponentBlur(){
        this.hide();
      }


}

