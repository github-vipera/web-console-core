import { InjectionToken } from '@angular/core';

export const WC_API_BASE_PATH = new InjectionToken<string>('apiBasePath');
export const WC_OAUTH_BASE_PATH = new InjectionToken<string>('oauthBasePath');
export const WC_OAUTH_LOGIN_PATH = new InjectionToken<string>('oauthLoginPath');
export const WC_OAUTH_REVOKE_PATH = new InjectionToken<string>('oauthRevokePath');
export const WC_OAUTH_CLIENT_ID = new InjectionToken<string>('oauthClientId');
export const WC_OAUTH_CONTENT_TYPE = new InjectionToken<string>('oauthContentType');



export const COLLECTION_FORMATS = {
    'csv': ',',
    'tsv': '   ',
    'ssv': ' ',
    'pipes': '|'
}
// Logging
export var WC_LOGGER_LEVEL = 1; //NgxLoggerLevel.DEBUG;
export var WC_SERVER_LOGGER_LEVEL = 7; //NgxLoggerLevel.OFF;
export var WC_SERVER_LOGGER_URL = '/api/logs';

export const WC_LOGGER_CONFIG = {
  WC_LOGGER_LEVEL: 1,
  WC_SERVER_LOGGER_LEVEL: 7,
  WC_SERVER_LOGGER_URL : '/api/logs'
}
