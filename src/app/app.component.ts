import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ringoffire';

  constructor(public translate: TranslateService) {
    // translate.use('en'); // Diese Funktion an Button/ Link verknüpfenvum zu übersetzen
  }
}
