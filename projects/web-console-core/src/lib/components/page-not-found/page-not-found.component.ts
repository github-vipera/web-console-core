import { NGXLogger } from 'ngx-logger';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation-service/navigation.service';

@Component({
  selector: 'web-console-page-not-found',
  styleUrls: ['./page-not-found.component.scss'],
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {

  public constructor(private logger: NGXLogger, private navService:NavigationService) {
    this.logger.debug("PageNotFoundComponent component constructor");
  }

  onReturnToDashboardClick(){
    this.navService.goToDashboard();
  }
}

