import { WC_SERVER_LOGGER_URL, WC_LOGGER_LEVEL, WC_SERVER_LOGGER_LEVEL, WC_LOGGER_CONFIG } from './variables';
import { NgModule } from '@angular/core'
import { LoggerModule as NgxLoggerModule, NgxLoggerLevel } from 'ngx-logger';


/**
 * see https://github.com/dbfannin/ngx-logger
 */

export * from 'ngx-logger';
export * from './types/web-console-logger-level';

//export const LoggerModule = NgxLoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG, serverLoggingUrl: '/api/logs', serverLogLevel: NgxLoggerLevel.OFF });
//export const LoggerModule = NgxLoggerModule.forRoot({ level: WC_LOGGER_CONFIG.WC_LOGGER_LEVEL, serverLoggingUrl: WC_LOGGER_CONFIG.WC_SERVER_LOGGER_URL, serverLogLevel: WC_LOGGER_CONFIG.WC_SERVER_LOGGER_LEVEL });
//this.logger.debug(">>>>>>>>>>>>> WC_LOGGER_CONFIG.WC_LOGGER_LEVEL=", WC_LOGGER_CONFIG.WC_LOGGER_LEVEL);

@NgModule({
  //imports:[ LoggerModule.forRoot({ level: WC_LOGGER_LEVEL, serverLoggingUrl: WC_SERVER_LOGGER_URL, serverLogLevel: WC_SERVER_LOGGER_LEVEL }) ],
  imports:[  ],
  exports:[  ],
    declarations: [
    ]
})
export class WebConsoleLoggerModule {


}
