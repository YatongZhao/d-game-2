import { v4 as uuidV4 } from 'uuid';
import { Bullet } from './Bullet';
import type { Game } from './Game';

export class Hero {
    level = 1;
    killNumber = 0;
    id = uuidV4();
    game: Game;

    x = 0;
    y = 0;

    static fromPosition(game: Game, position: {x: number, y: number}): Hero {
        let hero = new Hero(game);
        hero.setPosition(position);
        return hero;
    }

    constructor(game: Game) {
        this.game = game;
    }

    go() {
    }

    setPosition(position: {x: number, y: number}) {
        this.x = position.x;
        this.y = position.y;
    }
}

export class GrapeshotHero extends Hero {
    cycle = 5;
    bulletNumber = 5;

    static fromPosition(game: Game, position: {x: number, y: number}): GrapeshotHero {
        let hero = new GrapeshotHero(game);
        hero.setPosition(position);
        return hero;
    }

    go() {
        if (this.game.frameCounter.value % this.cycle === 0) {
            for (let i = 0; i < this.bulletNumber; i++) {
                this.game.bulletSet.add(new Bullet());
            }
        }
    }
}
