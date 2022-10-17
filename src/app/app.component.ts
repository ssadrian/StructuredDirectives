import {Component} from '@angular/core';

interface IEmoteLocation {
  name: string;
  location: string;
}

interface IClickableEmote {
  wasClicked: boolean;
  info: IEmoteLocation;
}

type GameState = "running" | "won";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StructuredDirectives';

  emoteLocations: IEmoteLocation[] = [];
  emoteButtons: IClickableEmote[] = [];
  pairsFound: number = 0;
  gameState: GameState = "running";

  ngOnInit(): void {
    let emoteNames: string[] = [
      "angry", "happy", "party", "sad", "smile", "smiling", "star", "thinking", "very_sad"
    ];

    let extension: string = "png";
    let basePath: string = "./assets/emotes";
    emoteNames.forEach(item => {
      let emote: IEmoteLocation = {name: item, location: `${basePath}/${item}.${extension}`};

      for (let i = 0; i < 2; i++) {
        this.emoteLocations.push(emote);
        this.emoteButtons.push({wasClicked: false, info: emote});
      }
    });

    this.initializeGame();
  }

  initializeGame(): void {
    this.pairsFound = 0;
    this.gameState = "running";
    this.shuffle<IClickableEmote>(this.emoteButtons);
  }

  shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  };
}
