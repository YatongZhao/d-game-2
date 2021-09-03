import { offStageHeroPosition, onStageHeroPosition } from "../const";
import type { Game } from "./Game";
import { GrapeshotHero, Hero, heroCopy } from "./Hero";

export type heroPos = {
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
        // this.onStageHero[1] = GrapeshotHero.fromPosition(game, onStageHeroPosition[1]);
        // this.onStageHero[2] = GrapeshotHero.fromPosition(game, onStageHeroPosition[2]);
        // this.onStageHero[3] = GrapeshotHero.fromPosition(game, onStageHeroPosition[3]);
        // this.onStageHero[4] = GrapeshotHero.fromPosition(game, onStageHeroPosition[4]);
        // this.onStageHero[5] = GrapeshotHero.fromPosition(game, onStageHeroPosition[5]);
        // this.onStageHero[6] = GrapeshotHero.fromPosition(game, onStageHeroPosition[6]);
        // this.onStageHero[7] = GrapeshotHero.fromPosition(game, onStageHeroPosition[7]);
        // this.onStageHero[8] = GrapeshotHero.fromPosition(game, onStageHeroPosition[8]);
        this.onStageNotNullHero.push(this.onStageHero[0]);
        // this.onStageNotNullHero.push(this.onStageHero[1]);
        // this.onStageNotNullHero.push(this.onStageHero[2]);
        // this.onStageNotNullHero.push(this.onStageHero[3]);
        // this.onStageNotNullHero.push(this.onStageHero[4]);
        // this.onStageNotNullHero.push(this.onStageHero[5]);
        // this.onStageNotNullHero.push(this.onStageHero[6]);
        // this.onStageNotNullHero.push(this.onStageHero[7]);
        // this.onStageNotNullHero.push(this.onStageHero[8]);
    }

    copyOffStageHero(): (heroCopy|null)[] {
        return this.offStageHero.map(hero => hero && ({
            level: hero.level,
            killNumber: hero.killNumber,
            id: hero.id,
            x: hero.x, y: hero.y
        }));
    }

    copyOnStageHero(): (heroCopy|null)[] {
        return this.onStageHero.map(hero => hero && ({
            level: hero.level,
            killNumber: hero.killNumber,
            id: hero.id,
            x: hero.x, y: hero.y
        }));
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
