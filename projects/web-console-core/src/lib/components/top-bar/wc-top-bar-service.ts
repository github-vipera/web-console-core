import { WCTopBarItem } from './wc-top-bar-item';
import { Injectable, Type }           from '@angular/core';
import { Observable }                 from 'rxjs';
import { Subject }                    from 'rxjs/Subject';
import { NGXLogger }                  from 'ngx-logger'

const LOG_TAG = '[WCTopBarService]';

export enum WCTopBarLocation {
  Right,
  Left,
  Center,
  Unknown
}

interface ItemIndexLocation {
  index:number;
  location?:WCTopBarLocation;
}

export interface StructureChangedEvent {
  items?: Array<WCTopBarItem>;
  location?: WCTopBarLocation;
  all:boolean;
}

@Injectable({
    providedIn:'root'
})
export class WCTopBarService {

  private _rightItems: WCTopBarItem[] = [];
  private _leftItems: WCTopBarItem[] = [];
  private _itemsSubject = new Subject<StructureChangedEvent>();

  constructor(private logger: NGXLogger){
    this.logger.debug(LOG_TAG, "ctor")
  }

  public registerItem(item: WCTopBarItem, location: WCTopBarLocation){
    this.logger.debug(LOG_TAG, "registerItem: ", item, location)
    let itemIndex = this.getItemIndex(item.id);
    if (itemIndex.index<0){
      let items:Array<WCTopBarItem> = null;
      if (location === WCTopBarLocation.Right){
        items = this._rightItems;
      } else if (location === WCTopBarLocation.Left){
        items = this._leftItems;
      }
      if (items){
        items.push(item);
      }
      this.notifyStructureChangeAll();
      this.logger.debug(LOG_TAG, "Current items: ", this._leftItems, this._rightItems);
    } else {
      this.logger.warn(LOG_TAG, "This item id already exits:", item);
    }
    return this;
}

  public getStructureChange(): Subject<StructureChangedEvent> {
    return this._itemsSubject;
  }

  public clear(): void {
     this._rightItems = new Array();
     this._leftItems = new Array();
     this.notifyStructureChangeAll();
  }

  private notifyStructureChangeAll(){
    this._itemsSubject.next({ all:true});
    this.logger.debug(LOG_TAG, "notifyStructureChangeAll notified");
  }

  private notifyStructureChange(location:WCTopBarLocation, items:Array<WCTopBarItem>){
    this._itemsSubject.next({ location: location, items: items, all:false});
  }

  public removeItem(id: string){
    let itemIndex = this.getItemIndex(id);
    if (itemIndex.index>=0){
      let items:Array<WCTopBarItem> = null;
      if (itemIndex.location==WCTopBarLocation.Left){
        items = this._leftItems;
      } else if (itemIndex.location==WCTopBarLocation.Right){
        items = this._rightItems;
      }
      if (items){
        items.splice(itemIndex.index, 1);
        this.notifyStructureChange(itemIndex.location, items);
      }
    } else {
      //not found
    }
  }

  private getItemIndex(id:string):ItemIndexLocation {
    let leftId = this.getLeftItemIndex(id);
    let rightId = this.getRightItemIndex(id);
    let index = -1;
    let location : WCTopBarLocation;
    if (leftId!=-1){
      location =  WCTopBarLocation.Left;
      index = leftId;
    }
    if (rightId!=-1){
      location =  WCTopBarLocation.Right;
      index = rightId;
    }
    return {
      index: index,
      location: (location?location:null)
    }
  }

  private getRightItemIndex(id:string):number {
    for (let i=0;i<this._rightItems.length;i++){
      let item:WCTopBarItem = this._rightItems[i];
      if (item.id === id ){
        return i;
      }
    }
    return -1;
  }

  private getLeftItemIndex(id:string):number {
    for (let i=0;i<this._rightItems.length;i++){
      let item:WCTopBarItem = this._rightItems[i];
      if (item.id === id ){
        return i;
      }
    }
    return -1;
  }

  public getItems(location:WCTopBarLocation):Array<WCTopBarItem> {
    this.logger.debug(LOG_TAG, "getItems", this._leftItems, this._rightItems);
    if (location == WCTopBarLocation.Right){
      return this._rightItems;
    } else if (location == WCTopBarLocation.Left) {
      return this._leftItems;
    } else {
      //not yet suppoted center items
      return [];
    }
  }


}
