import { AsyncPipe, NgIf, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { GameService } from '@ng-caro-game/shared';

@Component({
  selector: 'ng-caro-game-scoreboard',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgClass],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardComponent implements OnInit {
  readonly gameService = inject(GameService);
  readonly countdownTimer$ = this.gameService.countdownTimer$;

  ngOnInit(): void {
    this.subscribeNotifyHasWinningPlayer();
  }

  restartMatch(): void {
    this.gameService.restartMatch();
  }

  subscribeNotifyHasWinningPlayer(): void {
    this.gameService.notifyHasWinningPlayer$.subscribe(() => {
      setTimeout(() => {
        alert(`Player ${this.gameService.playerPlaying} win!!!`);
        this.gameService.restartGame();
      }, 300);
    });
  }
}
