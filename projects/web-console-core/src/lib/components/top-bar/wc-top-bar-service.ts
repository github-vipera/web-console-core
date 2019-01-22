import { WCTopBarItem } from './wc-top-bar-item';
import { Injectable, Type }           from '@angular/core';
import { Observable }                 from 'rxjs';
import { Subject }                    from 'rxjs/Subject';
import { NGXLogger }                  from 'ngx-logger'

const LOG_TAG = '[WCTopBarService]';


@Injectable({
    providedIn:'root'
})
export class WCTopBarService {

  private _items: WCTopBarItem[] = [];
  private _itemsSubject = new Subject<Array<WCTopBarItem>>();

  constructor(private logger: NGXLogger){
    this.logger.debug(LOG_TAG, "ctor")
  }

  public registerItem(item: WCTopBarItem){
    this.logger.debug(LOG_TAG, "registerItem: ", item)
    let itemIndex = this.getItemIndex(item.id);
    if (itemIndex<0){
      this._items.push(item);
      this.notifyStructureChange();
    } else {
      this.logger.warn(LOG_TAG, "This item id already exits:", item);
    }
    return this;
}

  public getStructureChange(): Observable<Array<WCTopBarItem>> {
    return this._itemsSubject.asObservable();
  }

  public clear(): void {
     this._items = new Array();
     this.notifyStructureChange();
  }

  private notifyStructureChange(){
    this._itemsSubject.next(this._items);
  }

  public removeItem(id: string){
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
      let item:WCTopBarItem = this._items[i];
      if (item.id === id ){
        return i;
      }
    }
    return -1;
  }

  public getItems():Array<WCTopBarItem> {
    this.logger.debug(LOG_TAG, "getItems", this._items)
    return this._items;
  }


}
