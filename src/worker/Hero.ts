import { v4 as uuidV4 } from 'uuid';
import { Bullet } from './Bullet';
import type { Game } from './Game';
import { GrapeshotBullet } from './GrapeshotBullet';

export type heroState = {
    level: number;
    killNumber: number;
    id: string;
    x: number;
    y: number;
    type: string;
}

export const createHeroState = (type: string): heroState => ({
    level: 1,
    killNumber: 0,
    id: uuidV4(),
    type,
    x: 0,
    y: 0,
});

export class Hero {
    level = 1;
    killNumber = 0;
    id = uuidV4();
    game: Game;
    type = 'default';

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

    patchState(heroState: heroState) {
        this.level = heroState.level;
        this.killNumber = heroState.killNumber;
        this.id = heroState.id;
        this.type = heroState.type;
        this.x = heroState.x;
        this.y = heroState.y;
    }

    produceState(): heroState {
        return {
            level: this.level,
            killNumber: this.killNumber,
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
        };
    }
}
