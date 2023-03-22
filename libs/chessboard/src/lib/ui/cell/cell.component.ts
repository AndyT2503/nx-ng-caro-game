import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit
} from '@angular/core';
import { Coordinate, GameService, PlayerIdType } from '@ng-caro-game/shared';
import { take } from 'rxjs';
@Component({
  selector: 'ng-caro-game-cell[coordinate]',
  standalone: true,
  imports: [NgClass],
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent implements OnInit {
  @Input() coordinate!: Coordinate;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly gameService = inject(GameService);
  isEven!: boolean;
  tickedBy?: PlayerIdType;
  ngOnInit(): void {
    this.isEven =
      (this.coordinate.y + this.coordinate.x) % 2 === 0;
  }

  onClickCell(): void {
    if (!this.gameService.isPlaying) {
      return;
    }
    const playerTicked = this.gameService.handlePlayerPlay(this.coordinate)
    if(!playerTicked) return;
    this.tickedBy = playerTicked;
    this.gameService.notifyRestartGame$.pipe(
      take(1)
    ).subscribe(() => {
      this.tickedBy = undefined;
      this.cdr.markForCheck();
    })
  }
}
