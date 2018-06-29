import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation-service/navigation.service';

@Component({
  selector: 'web-admin-page-not-found',
  styleUrls: ['./page-not-found.component.scss'],
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {

  public constructor(private navService:NavigationService) {
    console.log("PageNotFoundComponent component constructor");
  }

  onReturnToDashboardClick(){
    this.navService.goToDashboard();
  }
}

