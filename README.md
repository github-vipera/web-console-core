# WebConsoleCoreApp

## Logger Service

First you need to import the Logger Module into your App Module root in this way:

```typescript
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'
@NgModule({
  declarations: [
    AppComponent 
  ],
  imports: [
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.TRACE, serverLogLevel: NgxLoggerLevel.OFF})
  ]
})
export class AppModule { 

  constructor(private logger: NGXLogger){
    this.logger.info("AppModule" ,"Starting application");
  }

}
```
*(app.module.ts)*


Into your classes you need to import the NGXLogger:

```typescript
import { NGXLogger } from 'web-console-core';
```

and use it:

```typescript
this.logger.debug("MotifQueryService","constructor");
```

