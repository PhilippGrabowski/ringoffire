import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-drink-challenge',
  templateUrl: './drink-challenge.component.html',
  styleUrls: ['./drink-challenge.component.scss'],
})
export class DrinkChallengeComponent implements OnChanges {
  action = [
    {
      titel: 'Waterfall',
      description:
        'Everyone should keep drinking until the person who picked the card stops. So who knows how long you will be going for!',
    },
    { titel: 'Choose', description: 'You can choose someone to drink' },
    { titel: 'Me', description: 'You must drink' },
    { titel: 'Bitches', description: 'All girls must drink' },
    {
      titel: 'Thumb Master',
      description:
        'When you put your thumb on the table everyone must follow and whomever is last must drink. You are the thumb master till someone else picks a five',
    },
    { titel: 'Dicks', description: 'All guys drink' },
    {
      titel: 'Heaven',
      description: 'Point your finger in the sky, whoever is last must drink',
    },
    {
      titel: 'Mate',
      description:
        'Choose someone to drink with you. He/she, your drinking buddy, should always drink with you',
    },
    {
      titel: 'Rhyme',
      description:
        'Pick a word such as fog and the person next to you must rhyme with fog, like dog, and it goes to the next person and the next, in a circle, until someone messes up and he or she will have to drink',
    },
    {
      titel: 'Category',
      description:
        'Pick a category such as football and you go in a circle and everyone has to say a word that fits with football such as: touchdown, field goal, USC. Whoever messes up, drinks',
    },
    {
      titel: 'Rule',
      description:
        'You can make up any rule that everyone has to follow, such as you can only drink with your left hand. Everyone (including you) must follow this rule for the whole entire game and if you disobey you must drink',
    },
    {
      titel: 'Questions',
      description:
        'Go around in a circle and you have to keep asking questions to each other. Doesn’t matter what the question is, as long as its a question. Whoever messes up and does not say a question, drinks',
    },
    {
      titel: 'Pour!',
      description:
        'You must pour a little of your drink into the cup that is in the middle of the table. Whomever picks up the LAST king must drink the whole cup, which could be filled with different drinks, so who knows how bad it could taste!',
    },
  ];
  title: string = '';
  description: string = '';
  @Input() card: string | undefined;

  constructor() {}

  ngOnChanges() {
    if (this.card) {
      let cardNumber = +this.card.split('_')[1];
      this.title = this.action[cardNumber - 1].titel;
      this.description = this.action[cardNumber - 1].description;
    }
  }
}
