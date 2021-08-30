import { offStageHeroPosition, onStageHeroPosition } from "../const";
import type { Game } from "./Game";
import { GrapeshotHero, Hero } from "./Hero";

type heroPos = {
    stage: 'on'|'off';
    index: number;
}

export class HeroSet {
    game: Game;
    offStageHero: (Hero|null)[] = [null, null, null, null, null, null, null, null, null];
    onStageHero: (Hero|null)[] = [null, null, null, null, null, null, null, null, null];
    onStageNotNullHero: Hero[] = [];
    get canBuyNumber() {
        return this.offStageHero.filter(hero => !hero).length;
    }

    constructor(game: Game) {
        this.game = game;
        this.onStageHero[0] = GrapeshotHero.fromPosition(game, onStageHeroPosition[0]);
        this.onStageNotNullHero.push(this.onStageHero[0]);
    }

    go() {
        this.onStageNotNullHero.forEach(hero => hero.go());
    }

    add() {
        let index = this.offStageHero.findIndex(hero => !hero);
        let position = offStageHeroPosition[index];
        this.offStageHero[index] = GrapeshotHero.fromPosition(this.game, position);
    }

    move(pos1: heroPos, pos2: heroPos) {
        let stage1 = (pos1.stage === 'on' ? this.onStageHero : this.offStageHero);
        let position1 = (pos1.stage === 'on' ? onStageHeroPosition : offStageHeroPosition);
        let maybeHero1 = stage1[pos1.index];

        let stage2 = (pos2.stage === 'on' ? this.onStageHero : this.offStageHero);
        let position2 = (pos2.stage === 'on' ? onStageHeroPosition : offStageHeroPosition);
        let maybeHero2 = stage2[pos2.index];
        
        stage1[pos1.index] = maybeHero2;
        if (maybeHero2) {
            maybeHero2.setPosition(position1[pos1.index]);
        }

        stage2[pos2.index] = maybeHero1;
        if (maybeHero1) {
            maybeHero1.setPosition(position2[pos2.index]);
        }

        this.onStageNotNullHero = this.onStageHero.filter(Boolean) as Hero[];
    }
}
