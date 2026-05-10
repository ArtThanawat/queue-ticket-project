import { Component, inject } from '@angular/core';
import { AppConfigService } from '@core/services/app-config.service';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss'
})
export class AppLayout {
  protected readonly appConfig = inject(AppConfigService);
}
