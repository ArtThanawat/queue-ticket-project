import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  readonly name = environment.name;
  readonly production = environment.production;
  readonly apiUrl = environment.apiUrl;
  readonly appName = environment.appName;
  readonly appVersion = environment.appVersion;
  readonly buildVersion = environment.buildVersion;
}
