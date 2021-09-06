import type { Game } from "./Game";
import { GrapeshotBullet } from "./GrapeshotBullet";
import { Hero } from "./Hero";

export class GrapeshotHero extends Hero {
    cycle = 5;
    bulletNumber = 5;
    type = 'grapeshotHero';

    static fromPosition(game: Game, position: {x: number, y: number}): GrapeshotHero {
        let hero = new GrapeshotHero(game);
        hero.setPosition(position);
        return hero;
    }

    go() {
        if (this.game.frameCounter.value % this.cycle === 0) {
            for (let i = 0; i < this.bulletNumber; i++) {
                this.game.bulletSet.add(new GrapeshotBullet(this.game, this));
            }
        }
    }
}
