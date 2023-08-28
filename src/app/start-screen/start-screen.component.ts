import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/moduls/game';
import { trigger, style, animate, transition } from '@angular/animations';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
  animations: [
    trigger('fade-out', [
      transition(':enter', [
        style({ opacity: 1 }),
        animate('5s', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class StartScreenComponent implements OnInit {
  animateEnd: boolean = false;
  startAudio = new Audio('../../assets/audio/start-screen-theme.mp3');
  firestore: Firestore = inject(Firestore);
  game: Game | undefined;
  private gamesCollection: CollectionReference<DocumentData>;

  constructor(private router: Router) {
    this.gamesCollection = collection(this.firestore, 'games');
  }

  ngOnInit(): void {
    this.startAudio.volume = 0.2;
    this.startAudio.play();
    setTimeout(() => {
      this.animateEnd = true;
    }, 5000);
  }
  newGame() {
    this.game = new Game();
    this.startAudio.pause();
    addDoc(this.gamesCollection, this.game.toJson()).then((gameId) => {
      this.router.navigateByUrl('/games/' + gameId.id);
    });
  }
}
