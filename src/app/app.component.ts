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
  title: string = 'StructuredDirectives';

  #waitTimeMillis: number = 750;

  #emoteLocations: IEmoteLocation[] = [];
  emoteButtons: IClickableEmote[] = [];
  pairsFound: number = 0;
  pairsToFind: number = 0;
  gameState: GameState = "running";
  areButtonsClickable: boolean = true;
  defaultButtonCover: string = "assets/emotes/party.png";

  #lastSelectedEmote?: IClickableEmote;

  ngOnInit(): void {
    let emoteNames: string[] = [
      "angry", "happy", "party", "sad", "smile", "smiling", "star", "thinking", "very_sad"
    ];

    let extension: string = "png";
    let basePath: string = "./assets/emotes";
    emoteNames.forEach((item: string): void => {
      let emote: IEmoteLocation = {name: item, location: `${basePath}/${item}.${extension}`};

      for (let i: number = 0; i < 2 && !this.defaultButtonCover.includes(item); i++) {
        this.#emoteLocations.push(emote);
        this.emoteButtons.push({wasClicked: false, info: emote});
      }
    });

    this.initializeGame();
  }

  initializeGame(): void {
    this.pairsToFind = this.emoteButtons.length / 2;
    this.pairsFound = 0;
    this.gameState = "running";
    this.#shuffle<IClickableEmote>(this.emoteButtons);
    this.emoteButtons.forEach((emoteBtn: IClickableEmote): void => {
      emoteBtn.wasClicked = false;
    });
  }

  #shuffle<T>(array: T[]): T[] {
    let currentIndex: number = array.length, randomIndex;

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

  imageClick(clickableEmote: IClickableEmote): void {
    // Avoid emote matching on same emote button
    if (clickableEmote.wasClicked) {
      return;
    }

    clickableEmote.wasClicked = true;

    // Remember the last clicked/selected emote
    if (this.#lastSelectedEmote == undefined) {
      this.#lastSelectedEmote = clickableEmote;
      return;
    }

    // When emotes match their file/info name
    if (this.#lastSelectedEmote.info.name == clickableEmote.info.name) {
      this.pairsFound++;
      this.#lastSelectedEmote = undefined;
      this.#checkEndOfGame();
      return;
    }

    // Emotes are not matching, disallow clicking again
    this.areButtonsClickable = false;

    setTimeout((): void => {
      if (this.#lastSelectedEmote == null) {
        return;
      }

      // Hide the last selected and current emote
      this.#lastSelectedEmote.wasClicked = clickableEmote.wasClicked = false;
      this.#lastSelectedEmote = undefined;

      this.areButtonsClickable = true;
    }, this.#waitTimeMillis);
  }

  #checkEndOfGame(): void {
    this.gameState = this.pairsFound == this.pairsToFind ? "won" : "running";
  }
}
