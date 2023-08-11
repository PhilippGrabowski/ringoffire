import { Component, OnInit } from '@angular/core';
import { Game } from 'src/moduls/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string | undefined;
  game: Game | undefined;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game?.stack.pop(); // gibt letzten Wert des Arrays zurück und wird gleichzeitig entfernt
      this.pickCardAnimation = true;
      if (this.game) {
        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;
      }
      setTimeout(() => {
        if (this.currentCard) {
          this.game?.playedCards.push(this.currentCard);
        }
        this.pickCardAnimation = false;
      }, 1500);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name?.length > 0) {
        this.game?.players.push(name);
      }
    });
  }
}