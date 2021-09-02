import type { Game } from "./Game";

export class Enemy {
    game: Game;
    value = 0;
    index = 0;

    constructor(game: Game, value: number, index: number) {
        this.game = game;
        this.value = value;
        this.index = index;
    }

    copy() {
        return {
            value: this.value,
            index: this.index,
        }
    }

    hited(atk: number) {
        let _atk = this.value < atk ? this.value : atk;
        this.game.score += _atk;
        this.value -= _atk;

        let isKilled = this.value <= 0;
        if (isKilled) {
            this.game.currentRound.enemySet.aliveEnemyNumber--;
        }
        return isKilled;
    }
}

export type EnemyQueue = {
    enemy: Enemy;
    next: EnemyQueue|null;
}
