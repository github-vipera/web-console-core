import { Injectable, Type }           from '@angular/core';
import { StatusBarItem }              from './status-bar-item';
import { Observable }                 from 'rxjs';
import { Subject }                    from 'rxjs/Subject';
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { NGXLogger }                  from 'ngx-logger'
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as Rx from "rxjs";

@Injectable({
    providedIn:'root'
})
export class StatusBarService {

    //Statusbar structure
    private _items:Array<StatusBarItem> = new Array();
    private _itemsSubject = new Subject<Array<StatusBarItem>>();
    
    //Main Status Text value
    private _statusText = new Rx.BehaviorSubject<string>("Ready.");

    //Busy Indicator
    private _busyIndicatorVisible = new Rx.BehaviorSubject<boolean>(false);

    constructor(private logger:NGXLogger){
        this.logger.debug("StatusBarService", "ctor")
    }
  
    public addItem(item: StatusBarItem):StatusBarService {
      this.logger.debug("StatusBarService", "addItem")
      let itemIndex = this.getItemIndex(item.id);
      if (itemIndex<0){
        this._items.push(item);  
        this.notifyStructureChange();
      } else {
        this.logger.warn("StatusBarService", "This item id already exits:", item);
      }
      return this;
    }
  
    public removeItem(id:string){
      let itemIndex = this.getItemIndex(id);
      if (itemIndex>=0){
        this._items.splice(itemIndex, 1);
        this.notifyStructureChange();
      } else {
        //not found
      }
    }
  
    private getItemIndex(id:string):number {
      for (let i=0;i<this._items.length;i++){
        let item = this._items[i];
        if (item.id===id){
          return i;
        }
      }
      return -1;
    }
  
    public getItems():Array<StatusBarItem> {
      this.logger.debug("StatusBarService", "getItems", this._items)
      return this._items;
    }
  
    public getStructureChange(): Observable<Array<StatusBarItem>> {
      return this._itemsSubject.asObservable();
    }
  
    public clear(): void {
       this._items = new Array();
       this.notifyStructureChange();
    }
  
    private notifyStructureChange(){
      this._itemsSubject.next(this._items);    
    }

    public setStatus(statusText:string):void{
      this._statusText.next(statusText);
    }
    
    public getStatus():Observable<string>{
      return this._statusText.asObservable()
    }

    public setBusyIndicatorVisibile(visible:boolean):void{
      this._busyIndicatorVisible.next(visible)
    }
    
    public isBusyIndicatorVisible():Observable<boolean>{
      return this._busyIndicatorVisible.asObservable()
    }

}
