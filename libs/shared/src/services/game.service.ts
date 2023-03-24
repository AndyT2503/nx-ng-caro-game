import { EventEmitter, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  map,
  startWith,
  Subscription,
  take,
} from 'rxjs';
import { playerId, PlayerIdType } from '../const';
import { Coordinate } from '../models';

@Injectable()
export class GameService {
  private cellTicked: Record<PlayerIdType, Coordinate[]> = {
    [playerId.player1]: [],
    [playerId.player2]: [],
  };
  private _scoreBoard$ = new BehaviorSubject<Record<PlayerIdType, number>>({
    [playerId.player1]: 0,
    [playerId.player2]: 0,
  });
  private subscription!: Subscription;
  private _notifyRestartGame$ = new EventEmitter<void>();
  private _notifyHasWinningPlayer$ = new EventEmitter<void>(true);
  private _countdownTimer$ = new EventEmitter<string>();
  private _playerPlaying!: PlayerIdType;

  get scoreBoard$() {
    return this._scoreBoard$.asObservable();
  }

  get notifyHasWinningPlayer$() {
    return this._notifyHasWinningPlayer$.asObservable();
  }

  get notifyRestartGame$() {
    return this._notifyRestartGame$.asObservable();
  }
  get playerPlaying() {
    return this._playerPlaying;
  }
  get countdownTimer$() {
    return this._countdownTimer$.asObservable();
  }
  isPlaying = false;

  handlePlayerPlay(cell: Coordinate): false | PlayerIdType {
    if (
      this.cellTicked[this._playerPlaying].some(
        (x) => x.y === cell.y && x.x === cell.x
      )
    ) {
      return false;
    }
    const playerPlaying = this.playerPlaying;
    this.cellTicked[this.playerPlaying].push(cell);
    if (!this.hasPlayerWin(cell)) {
      this.switchPlayerPlaying();
      this.resetTimer();
    } else {
      this.updateScoreBoard(playerPlaying);
      this._notifyHasWinningPlayer$.next();
    }

    return playerPlaying;
  }

  private updateScoreBoard(playerWinning: PlayerIdType): void {
    const currentScoreBoard = this._scoreBoard$.getValue();
    const currentScoreOfPlayerWinning = currentScoreBoard[playerWinning];
    const newScoreBoard = {
      ...currentScoreBoard,
      [`${playerWinning}`]: currentScoreOfPlayerWinning + 1,
    };
    this._scoreBoard$.next(newScoreBoard);
  }

  private hasPlayerWin(newCell: Coordinate): boolean {
    const cellsTicked = this.cellTicked[this.playerPlaying];
    if (cellsTicked.length < 5) return false;
    return (
      this.checkHorizontalLine(newCell, cellsTicked) ||
      this.checkVerticalLine(newCell, cellsTicked) ||
      this.checkDiagonalLine1(newCell, cellsTicked) ||
      this.checkDiagonalLine2(newCell, cellsTicked)
    );
  }

  private checkHorizontalLine(
    newCell: Coordinate,
    cellsTicked: Coordinate[]
  ): boolean {
    let lineOfCurrentUser: Coordinate[] = [newCell];
    for (let i = 1; i < 5; i++) {
      lineOfCurrentUser.push({
        y: newCell.y,
        x: newCell.x - i,
      });
      lineOfCurrentUser.push({
        y: newCell.y,
        x: newCell.x + i,
      });
    }
    lineOfCurrentUser = lineOfCurrentUser.filter((point) =>
      cellsTicked.some((i) => i.x === point.x && i.y === point.y)
    );
    if (lineOfCurrentUser.length < 5) return false;
    lineOfCurrentUser = lineOfCurrentUser.sort((a, b) => a.x - b.x);
    let winningLine = [lineOfCurrentUser[0]];
    for (
      let i = 1, lineLength = lineOfCurrentUser.length;
      i < lineLength;
      i++
    ) {
      if (lineOfCurrentUser[i].x - lineOfCurrentUser[i - 1].x === 1) {
        winningLine.push(lineOfCurrentUser[i]);
      } else {
        winningLine = [lineOfCurrentUser[i]];
      }
    }
    return winningLine.length >= 5;
  }

  private checkVerticalLine(
    newCell: Coordinate,
    cellsTicked: Coordinate[]
  ): boolean {
    let lineOfCurrentUser: Coordinate[] = [newCell];
    for (let i = 1; i < 5; i++) {
      lineOfCurrentUser.push({
        y: newCell.y - i,
        x: newCell.x,
      });
      lineOfCurrentUser.push({
        y: newCell.y + i,
        x: newCell.x,
      });
    }
    lineOfCurrentUser = lineOfCurrentUser.filter((point) =>
      cellsTicked.some((i) => i.x === point.x && i.y === point.y)
    );
    if (lineOfCurrentUser.length < 5) return false;
    lineOfCurrentUser = lineOfCurrentUser.sort((a, b) => a.y - b.y);
    let winningLine = [lineOfCurrentUser[0]];
    for (
      let i = 1, lineLength = lineOfCurrentUser.length;
      i < lineLength;
      i++
    ) {
      if (lineOfCurrentUser[i].y - lineOfCurrentUser[i - 1].y === 1) {
        winningLine.push(lineOfCurrentUser[i]);
      } else {
        winningLine = [lineOfCurrentUser[i]];
      }
    }
    return winningLine.length >= 5;
  }

  private checkDiagonalLine1(
    newCell: Coordinate,
    cellsTicked: Coordinate[]
  ): boolean {
    let lineOfCurrentUser: Coordinate[] = [newCell];
    for (let i = 1; i < 5; i++) {
      lineOfCurrentUser.push({
        y: newCell.y - i,
        x: newCell.x - i,
      });
      lineOfCurrentUser.push({
        y: newCell.y + i,
        x: newCell.x + i,
      });
    }
    lineOfCurrentUser = lineOfCurrentUser.filter((point) =>
      cellsTicked.some((i) => i.x === point.x && i.y === point.y)
    );
    if (lineOfCurrentUser.length < 5) return false;
    lineOfCurrentUser = lineOfCurrentUser.sort(
      (a, b) => a.x + a.y - (b.x + b.y)
    );
    let winningLine = [lineOfCurrentUser[0]];
    for (
      let i = 1, lineLength = lineOfCurrentUser.length;
      i < lineLength;
      i++
    ) {
      if (
        lineOfCurrentUser[i].x +
          lineOfCurrentUser[i].y -
          (lineOfCurrentUser[i - 1].x + lineOfCurrentUser[i - 1].y) ===
        2
      ) {
        winningLine.push(lineOfCurrentUser[i]);
      } else {
        winningLine = [lineOfCurrentUser[i]];
      }
    }
    return winningLine.length >= 5;
  }

  private checkDiagonalLine2(
    newCell: Coordinate,
    cellsTicked: Coordinate[]
  ): boolean {
    let lineOfCurrentUser: Coordinate[] = [newCell];
    for (let i = 1; i < 5; i++) {
      lineOfCurrentUser.push({
        y: newCell.y - i,
        x: newCell.x + i,
      });
      lineOfCurrentUser.push({
        y: newCell.y + i,
        x: newCell.x - i,
      });
    }
    lineOfCurrentUser = lineOfCurrentUser.filter((point) =>
      cellsTicked.some((i) => i.x === point.x && i.y === point.y)
    );
    if (lineOfCurrentUser.length < 5) return false;
    lineOfCurrentUser = lineOfCurrentUser.sort(
      (a, b) => a.x + a.y - (b.x + b.y)
    );
    let winningLine = [lineOfCurrentUser[0]];
    for (
      let i = 1, lineLength = lineOfCurrentUser.length;
      i < lineLength;
      i++
    ) {
      if (
        lineOfCurrentUser[i].x +
          lineOfCurrentUser[i].y -
          (lineOfCurrentUser[i - 1].x + lineOfCurrentUser[i - 1].y) ===
        0
      ) {
        winningLine.push(lineOfCurrentUser[i]);
      } else {
        winningLine = [lineOfCurrentUser[i]];
      }
    }
    return winningLine.length >= 5;
  }

  private switchPlayerPlaying(): void {
    this._playerPlaying =
      this._playerPlaying === playerId.player1
        ? playerId.player2
        : playerId.player1;
  }

  restartGame(): void {
    this.isPlaying = true;
    this.switchPlayerPlaying();
    this.resetTimer();
    this.cellTicked = {
      [playerId.player1]: [],
      [playerId.player2]: [],
    };
    this._notifyRestartGame$.next();
  }

  restartMatch(): void {
    this._scoreBoard$.next({
      [playerId.player1]: 0,
      [playerId.player2]: 0,
    });
    this.restartGame();
  }

  private resetTimer(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const maxLimitTime = 60;
    let limitTime = maxLimitTime;
    this.subscription = interval(1000)
      .pipe(
        startWith(0),
        map(() => {
          return `${new Intl.NumberFormat('en-US', {
            minimumIntegerDigits: 2,
          }).format(Math.floor(limitTime / 60))}:${new Intl.NumberFormat(
            'en-US',
            {
              minimumIntegerDigits: 2,
            }
          ).format(limitTime-- % 60)}`;
        }),
        take(maxLimitTime)
      )
      .subscribe({
        next: (value) => {
          this._countdownTimer$.next(value);
        },
        complete: () => {
          this.switchPlayerPlaying();
          this.resetTimer();
        },
      });
  }
}
