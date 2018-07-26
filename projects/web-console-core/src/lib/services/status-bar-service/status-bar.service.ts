import { Injectable } from "@angular/core";
import { StatusBarItem } from '../../components/status-bar/status-bar-item'

@Injectable({
    providedIn:'root'
})
export class StatusBarService {

    private _items:Array<StatusBarItem> = [];

    public addItem(sbItem:StatusBarItem):void {
        this._items.push(sbItem);
    }

    public getItems():Array<StatusBarItem>{
        return this._items;
    }
}
