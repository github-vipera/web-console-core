import { Injectable, Type }           from '@angular/core';
import { StatusBarItem }              from './status-bar-item';
import { Observable }                 from 'rxjs';
import { Subject }                    from 'rxjs/Subject';
import { NGXLogger }                  from 'ngx-logger'

@Injectable({
    providedIn:'root'
})
export class StatusBarService {

    private _items:Array<StatusBarItem> = new Array();
    private subject = new Subject<Array<StatusBarItem>>();
  
    constructor(private logger:NGXLogger){
        this.logger.debug("StatusBarService", "ctor")
    }
  
    public addItem(item: StatusBarItem):StatusBarService {
      this.logger.debug("StatusBarService", "addItem")
      let itemIndex = this.getItemIndex(item.id);
      if (itemIndex<0){
        this._items.push(item);  
        this.notifySubject();
      } else {
        this.logger.warn("StatusBarService", "This item id already exits:", item);
      }
      return this;
    }
  
    public removeItem(id:string){
      let itemIndex = this.getItemIndex(id);
      if (itemIndex>=0){
        this._items.splice(itemIndex, 1);
        this.notifySubject();
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
  
    public getDynamicItems(): Observable<Array<StatusBarItem>> {
      return this.subject.asObservable();
    }
  
    public clear(): void {
       this._items = new Array();
       this.notifySubject();
    }
  
    private notifySubject(){
      this.subject.next(this._items);    
    }
  
}
