import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService, WebConsoleConfig, NGXLogger, LoggerModule, NgxLoggerLevel, EventBusService } from 'web-console-core';
import * as _ from 'lodash';

import { failLogin, failTestWithError, b64toFile, blobToB64 } from '../../../test-helper';
import { TEST_BASE_PATH, TEST_OAUTH2_BASE_PATH, TEST_USERNAME, TEST_PASSWORD } from '../../../test.variables';
import { LoginRequest } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        NGXLogger,
        { provide: WebConsoleConfig, useValue: new WebConsoleConfig('', '') }
      ],
      imports: [HttpClientModule, LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG })]
    });

    const httpClient = TestBed.get(HttpClient);
    const logger: NGXLogger = TestBed.get(NGXLogger);
    service = new AuthService(httpClient, TEST_OAUTH2_BASE_PATH, null, null, new EventBusService(logger), logger);
  });

  beforeEach(() => {
  });

  afterEach(() => {
  });

  it(`should login`,
    async(
      () => {
        const lr: LoginRequest = {
          userName: 'admin',
          password: 'admin'
        }
        service.login(lr).subscribe((resp) => {
          console.log('login completed');
        }, (err) => {
          failTestWithError('should login', err);
        });
      }
    )
  );

  it(`should logout`,
    async(
      () => {
        service.logout().subscribe((resp) => {
          console.log('logout completed');
        }, (err) => {
          failTestWithError('should logout', err);
        });
      }
    )
  );
});
