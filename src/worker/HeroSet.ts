import { offStageHeroPosition, onStageHeroPosition } from "../const";
import type { Game } from "./Game";
import { GrapeshotHero } from "./GrapeshotHero";
import type { Hero, heroState } from "./Hero";

export type heroPos = {
    stage: 'on'|'off';
    index: number;
}

export type heroType = 'grapeshotHero';

export function findAddHeroIndex(offStageHero: (any|null)[]): number {
    return offStageHero.findIndex(hero => !hero);
}

export class HeroSet {
    game: Game;
    offStageHero: (Hero|null)[] = [null, null, null, null, null, null, null, null, null];
    onStageHero: (Hero|null)[] = [null, null, null, null, null, null, null, null, null];
    onStageNotNullHero: Hero[] = [];
    operationTime = 0;
    get canBuyNumber() {
        return this.offStageHero.filter(hero => !hero).length;
    }

    constructor(game: Game) {
        this.game = game;
        // this.onStageHero[0] = GrapeshotHero.fromPosition(game, onStageHeroPosition[0]);
        // this.onStageHero[1] = GrapeshotHero.fromPosition(game, onStageHeroPosition[1]);
        // this.onStageHero[2] = GrapeshotHero.fromPosition(game, onStageHeroPosition[2]);
        // this.onStageHero[3] = GrapeshotHero.fromPosition(game, onStageHeroPosition[3]);
        // this.onStageHero[4] = GrapeshotHero.fromPosition(game, onStageHeroPosition[4]);
        // this.onStageHero[5] = GrapeshotHero.fromPosition(game, onStageHeroPosition[5]);
        // this.onStageHero[6] = GrapeshotHero.fromPosition(game, onStageHeroPosition[6]);
        // this.onStageHero[7] = GrapeshotHero.fromPosition(game, onStageHeroPosition[7]);
        // this.onStageHero[8] = GrapeshotHero.fromPosition(game, onStageHeroPosition[8]);
        // this.onStageNotNullHero.push(this.onStageHero[0]);
        // this.onStageNotNullHero.push(this.onStageHero[1]);
        // this.onStageNotNullHero.push(this.onStageHero[2]);
        // this.onStageNotNullHero.push(this.onStageHero[3]);
        // this.onStageNotNullHero.push(this.onStageHero[4]);
        // this.onStageNotNullHero.push(this.onStageHero[5]);
        // this.onStageNotNullHero.push(this.onStageHero[6]);
        // this.onStageNotNullHero.push(this.onStageHero[7]);
        // this.onStageNotNullHero.push(this.onStageHero[8]);
    }

    copyOffStageHero(): (heroState|null)[] {
        return this.offStageHero.map(hero => hero && ({
            level: hero.level,
            killNumber: hero.killNumber,
            id: hero.id,
            x: hero.x, y: hero.y,
            type: hero.type,
        }));
    }

    copyOnStageHero(): (heroState|null)[] {
        return this.onStageHero.map(hero => hero && ({
            level: hero.level,
            killNumber: hero.killNumber,
            id: hero.id,
            x: hero.x, y: hero.y,
            type: hero.type,
        }));
    }

    go() {
        this.onStageNotNullHero.forEach(hero => hero.go());
    }

    add(heroType: heroType) {
        let index = findAddHeroIndex(this.offStageHero);
        let position = offStageHeroPosition[index];
        switch (heroType) {
            case 'grapeshotHero':
            default:
                this.offStageHero[index] = GrapeshotHero.fromPosition(this.game, position);
                break;
        }
    }

    delete(id: string) {
        this.onStageHero = this.onStageHero.map(maybeHero => {
            return (maybeHero && maybeHero.id === id)
                ? null
                : maybeHero;
        });
        this.offStageHero = this.offStageHero.map(maybeHero => {
            return (maybeHero && maybeHero.id === id)
                ? null
                : maybeHero;
        });
        this.onStageNotNullHero = this.onStageHero.filter(Boolean) as Hero[];
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
