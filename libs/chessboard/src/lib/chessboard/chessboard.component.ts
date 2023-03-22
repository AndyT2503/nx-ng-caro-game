import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CellComponent } from '../ui/cell/cell.component';

@Component({
  selector: 'ng-caro-game-chessboard',
  standalone: true,
  imports: [NgForOf, CellComponent],
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChessboardComponent implements OnInit {
  @ViewChild('chessBoardContainer', { static: true, read: ElementRef })
  chessBoardContainer!: ElementRef;
  private readonly CELL_SIZE = 25;
  cols = 0;
  rows = 0;

  ngOnInit(): void {
    this.getNumberRowsAndColumn();
  }

  getNumberRowsAndColumn(): void {
    const chessBoardElement = this.chessBoardContainer
      .nativeElement as HTMLElement;
    this.rows = chessBoardElement.offsetHeight / this.CELL_SIZE;
    this.cols = chessBoardElement.offsetWidth / this.CELL_SIZE;
  }
}
