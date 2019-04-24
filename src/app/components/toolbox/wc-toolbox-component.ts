import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { inOutQuintic } from 'ngx-scrollbar';

export interface WCToolboxItem {
  id:string;
  title:string;
}



@Component({
  selector: 'wc-toolbox-component',
  templateUrl: './wc-toolbox-component.html',
  styleUrls: ['./wc-toolbox-component.scss']
})
export class WCToolbox implements OnInit{

  @Input() items : Array<WCToolboxItem> = [];
  @ViewChild('toolboxContainer') _toolboxContainer: ElementRef;
  @ViewChild('toolbox') _toolbox: ElementRef;

  scrollbarsVisible: boolean;

  constructor(){
    console.log("ExtComponent constructor")
  }

  ngOnInit(){
  }

  onItemMouseOver(event, item){
    /*let elmt = event.srcElement;
    var rect = elmt.getBoundingClientRect();
    console.log("onItemMouseOver event:", item.id);
    */
   let itemEl = document.getElementById("toolbox-item-"+ item.id);
   let pinItemEl = document.getElementById("toolbox-item-pin-"+ item.id);
   var rectEl = itemEl.getBoundingClientRect();
   let topValue = ""+ (rectEl.top - this._toolbox.nativeElement.parentElement.parentElement.offsetTop) +"px";
   let leftValue = ""+ (rectEl.left - this._toolbox.nativeElement.parentElement.parentElement.offsetLeft) +"px";
   console.log("rectEl.height ", this._toolbox.nativeElement.parentElement.parentElement.offsetTop);
   pinItemEl.style.top = topValue;
   pinItemEl.style.left = leftValue;
  }

  scrollUpCLick(event){
    this._toolboxContainer.nativeElement.scrollTop += 150;
    console.log("scrollUpCLick ", this._toolboxContainer.nativeElement.scrollTop);
  }

  scrollDownCLick(event){
    this._toolboxContainer.nativeElement.scrollTop -= 150;
    console.log("scrollDownCLick ", this._toolboxContainer.nativeElement.scrollTop);
  }

  onResize(event){
    this.scrollbarsVisible = this._toolboxContainer.nativeElement.scrollHeight > this._toolboxContainer.nativeElement.clientHeight;
    console.log("this.scrollbarsVisible :", this.scrollbarsVisible);
  }

}
