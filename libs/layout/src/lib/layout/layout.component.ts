import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChessboardComponent } from '@ng-caro-game/chessboard';
import { ScoreboardComponent } from '@ng-caro-game/scoreboard';
import { GameService } from '@ng-caro-game/shared';

@Component({
  selector: 'ng-caro-game-layout',
  standalone: true,
  imports: [ScoreboardComponent, ChessboardComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GameService]
})
export default class LayoutComponent {}
