import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

const LOG_TAG = "[EventBusService]";

export interface BroadcastEvent {
  key: any;
  data?: any;
}


@Injectable({
  providedIn: 'root'
})
export class EventBusService implements OnInit, OnDestroy {

  private _eventBus: Subject<BroadcastEvent>;

  constructor(private logger: NGXLogger) {
    this.logger.debug(LOG_TAG, "constructor");
    this._eventBus = new Subject<BroadcastEvent>();
  }


  ngOnInit(): void {
    this.logger.debug(LOG_TAG, "init")
  }

  ngOnDestroy(): void {
  }


  broadcast(key: any, data?: any) {
    this.logger.debug(LOG_TAG, "broadcast called for: ", key, data);
    this._eventBus.next({ key, data });
  }

  on<T>(key: any): Observable<T> {
    this.logger.debug(LOG_TAG, "on subscription called for : ", key);
    return this._eventBus.asObservable()
      .filter(event => event.key === key)
      .map(event => <T>event.data);
  }


}
