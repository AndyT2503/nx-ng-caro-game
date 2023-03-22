import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'ng-caro-game-root',
  template: '<router-outlet />',
})
export class AppComponent {
  static bootstrap(): void {
    bootstrapApplication(this, {
      providers: [
        provideRouter([
          {
            path: '',
            loadChildren: () =>
              import('@ng-caro-game/layout').then((m) => m.layoutRoutes),
          },
        ]),
      ],
    }).catch((err) => console.error(err));
  }
}
