import { NgModule } from '@angular/core'
import { LoggerModule } from 'ngx-logger';


/**
 * see https://github.com/dbfannin/ngx-logger
 */

export * from 'ngx-logger';
export * from './types/web-console-logger-level';

@NgModule({
    imports:[ LoggerModule ],
    exports:[ LoggerModule ],
    declarations: [
    ]
})
export class WebConsoleLoggerModule {
    
}

