import { battleGroundDistance, battleGroundHeight, battleGroundWidth } from "../const";
import { Bullet } from "./Bullet";
import type { Game } from "./Game";
import type { Hero } from "./Hero";

export class GrapeshotBullet extends Bullet {
    game: Game;
    hero: Hero;
    x = 0;
    y = 0;
    size = 4;
    direction = 0;
    speed = 200;
    ATK = 1;

    isDied = false;

    constructor(game: Game, hero: Hero) {
        super();
        this.game = game;
        this.hero = hero;
        this.x = this.hero.x;
        this.y = this.hero.y + battleGroundDistance;
        this.direction = Math.PI*0.4*(Math.random() - 0.5);
        this.direction === 0 && (this.direction = Math.PI*0.1);
        this.speed = 300 + Math.floor(Math.random() * 300);
    }

    copy() {
        return {
            x: this.x, y: this.y,
            size: this.size,
            direction: this.direction,
            speed: this.speed,
            ATK: this.ATK,
            isDied: this.isDied,
        }
    }

    go() {
        for (let i = 0; i < this.speed; i++) {
            this.x += Math.sin(this.direction);
            this.y -= Math.cos(this.direction);

            if (this.y < 0 || this.y > battleGroundHeight
                || this.x < 0 || this.x > battleGroundWidth) {
                    this.isDied = true;
                    return;
            }

            let maybeEnemy = this.game.currentRound.enemySet.findEnemyByPoint(Math.round(this.x), Math.round(this.y));

            if (maybeEnemy) {
                let isKilled = maybeEnemy.hited(this.ATK);
                if (isKilled) {
                    this.game.$++;
                }
                this.isDied = true;
                return;
            }
        }
    }
}
