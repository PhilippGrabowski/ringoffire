import { Component, OnInit } from '@angular/core';
import { Game } from 'src/moduls/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { DialogEditPlayerComponent } from '../dialog-edit-player/dialog-edit-player.component';
import { inject } from '@angular/core';
import { Firestore, doc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  flipCardAudio = new Audio('../../assets/audio/flip-card.mp3');
  game: Game | undefined;
  firestore: Firestore = inject(Firestore);
  gameId: string | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.updateGame();
    });
  }

  newGame() {
    this.game = new Game();
  }

  updateGame() {
    onSnapshot(doc(this.firestore, `games/${this.gameId}`), (doc) => {
      const data = doc.data();
      if (data && this.game) {
        this.game.currentCard = data['currentCard'];
        this.game.currentPlayer = data['currentPlayer'];
        this.game.pickCardAnimation = data['pickCardAnimation'];
        this.game.playedCards = data['playedCards'];
        this.game.players = data['players'];
        this.game.stack = data['stack'];
      }
    });
  }

  takeCard() {
    if (!this.game?.pickCardAnimation && this.game) {
      if (this.game.players.length > 1) {
        this.flipCard();
        this.addToPlayedCardStack();
        this.removeCardFromStack();
        this.showNextPlayer();
        setTimeout(() => {
          this.displayArrows();
        }, 2000);
      }
    }
  }

  flipCard() {
    if (this.game) {
      this.flipCardAudio.play();
      this.game.currentCard = this.game.stack.pop(); // gibt letzten Wert des Arrays zurück und wird gleichzeitig entfernt
      this.game.pickCardAnimation = true;
    }
  }

  addToPlayedCardStack() {
    setTimeout(() => {
      if (this.game?.currentCard && this.game) {
        this.game.playedCards.push(this.game.currentCard);
        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;
        this.game.pickCardAnimation = false;
        this.saveGame();
      }
    }, 1500);
  }

  removeCardFromStack() {
    let stackAmount = this.game?.stack.length;
    let topCard = document.getElementById('top_card');
    if (topCard) {
      switch (stackAmount) {
        case 3:
          document.getElementById('stack_card3')?.classList.add('d-none');
          topCard.style.right = '20px';
          break;
        case 2:
          document.getElementById('stack_card2')?.classList.add('d-none');
          topCard.style.right = '15px';
          break;
        case 1:
          document.getElementById('stack_card1')?.classList.add('d-none');
          topCard.style.right = '10px';
          break;
        case 0:
          document.getElementById('stack_card0')?.classList.add('d-none');
          topCard.classList.add('d-none');
          this.openGameOverContainer();
          break;
      }
    }
  }

  showNextPlayer() {
    setTimeout(() => {
      let element = document.querySelectorAll('.player_active');
      element.forEach((e) => {
        e.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'start',
        });
      });
    }, 1600);
  }

  displayArrows() {
    let container = document.querySelector('.player_subcontainer');
    let mobileContainer = document.querySelector('.mobile_player_subcontainer');
    let players = document.querySelectorAll('.player');
    if (container && players) {
      this.displayArrowTop(container, players);
      this.displayArrowBottom(container, players);
    }
    if (mobileContainer && players) {
      this.displayArrowLeft(mobileContainer, players);
      this.displayArrowRight(mobileContainer, players);
    }
  }

  displayArrowTop(container: Element, players: NodeListOf<Element>) {
    if (
      players[0].classList.contains('player_active') ||
      container?.scrollTop === 0
    ) {
      document.getElementById('arrow_up')?.classList.add('d-none');
    } else if (container?.scrollTop !== 0) {
      document.getElementById('arrow_up')?.classList.remove('d-none');
    }
  }

  displayArrowBottom(container: Element, players: NodeListOf<Element>) {
    let containerRect = container?.getBoundingClientRect();
    if (container?.scrollHeight > containerRect.height) {
      document.getElementById('arrow_down')?.classList.remove('d-none');
    }
    if (players[players.length - 1].classList.contains('player_active')) {
      document.getElementById('arrow_down')?.classList.add('d-none');
    }
  }

  displayArrowLeft(container: Element, players: NodeListOf<Element>) {
    if (
      players[0].classList.contains('player_active') ||
      container?.scrollLeft === 0
    ) {
      document.getElementById('arrow_left')?.classList.add('d-none');
    } else if (container?.scrollLeft !== 0) {
      document.getElementById('arrow_left')?.classList.remove('d-none');
    }
  }

  displayArrowRight(container: Element, players: NodeListOf<Element>) {
    let containerRect = container?.getBoundingClientRect();
    let lastPlayerRect = players[players.length - 1].getBoundingClientRect();
    if (container?.scrollWidth > containerRect.width) {
      document.getElementById('arrow_right')?.classList.remove('d-none');
    }
    if (
      players[players.length - 1].classList.contains('player_active') ||
      lastPlayerRect.right <= containerRect.right + 10
    ) {
      document.getElementById('arrow_right')?.classList.add('d-none');
    }
  }

  openDialog(): void {
    if (this.game) {
      if (this.game.players.length < 8) {
        const dialogRef = this.dialog.open(DialogAddPlayerComponent);
        dialogRef.afterClosed().subscribe((name) => {
          this.addPlayer(name);
        });
      } else {
        this.reachedMaxPlayers();
      }
    }
  }

  reachedMaxPlayers() {
    document.getElementById('max_player_container')?.classList.remove('d-none');
  }

  openEditPlayerDialog(index: number) {
    if (this.game) {
      const dialogRef = this.dialog.open(DialogEditPlayerComponent, {
        data: this.game.players[index],
      });
      dialogRef.afterClosed().subscribe((change) => {
        if (change == 'remove') {
          this.deletePlayer(index);
        } else {
          this.editPlayer(change, index);
        }
      });
    }
  }

  addPlayer(name: string) {
    if (name?.length > 0) {
      this.game?.players.push(name);
      this.saveGame();
      setTimeout(() => {
        this.displayArrows();
      }, 500);
    }
  }

  editPlayer(name: string, index: number) {
    if (this.game && name) {
      this.game.players[index] = name;
      this.saveGame();
    }
  }

  deletePlayer(index: number) {
    this.game?.players.splice(index, 1);
    this.saveGame();
  }

  saveGame() {
    const gameDocumentReference = doc(this.firestore, `games/${this.gameId}`);
    return setDoc(gameDocumentReference, { ...this.game?.toJson() }); // Spread operator, um game object zu kopieren
  }

  endGame() {
    this.router.navigateByUrl('');
  }
  restartGame() {
    this.displayNewStack();
    this.newGame();
    document.getElementById('game_over_container')?.classList.add('d-none');
  }

  displayNewStack() {
    for (let i = 0; i < 4; i++) {
      document.getElementById(`stack_card${i}`)?.classList.remove('d-none');
    }
    let topCard = document.getElementById('top_card');
    if (topCard) {
      topCard.style.right = '25px';
      topCard.classList.remove('d-none');
    }
  }

  hideElement(id: string) {
    document.getElementById(id)?.classList.add('d-none');
  }

  openGameOverContainer() {
    setTimeout(() => {
      document
        .getElementById('game_over_container')
        ?.classList.remove('d-none');
    }, 1000);
  }
}
