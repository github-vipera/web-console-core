import { InjectionToken } from '@angular/core';

export const WC_API_BASE_PATH = new InjectionToken<string>('apiBasePath');
export const WC_OAUTH_BASE_PATH = new InjectionToken<string>('oauthBasePath');
export const COLLECTION_FORMATS = {
    'csv': ',',
    'tsv': '   ',
    'ssv': ' ',
    'pipes': '|'
}
