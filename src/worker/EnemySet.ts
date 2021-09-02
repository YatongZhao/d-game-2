import { battleGroundDistance, enemyColumn, enemyRow, enemySize, enemyXSpace, enemyXStartPadding, enemyYSpace } from "../const";
import { Enemy, EnemyQueue } from "./Enemy";
import type { Round } from "./Round";

export type enemySetCopy = {
    enemys: ({ index: number; value: number; }|null)[];
    aliveEnemyNumber: number;
    lengthTraveled: number;
}

export class EnemySet {
    static initSpeed = 3;
    enemys: Enemy[] = [];
    aliveEnemyNumber = 0;
    enemyOnGroundQueue: EnemyQueue|null = null;
    lengthTraveled = -enemySize - 2;
    speed = EnemySet.initSpeed;
    endLineIndex = 0;
    round: Round;

    constructor(round: Round) {
        this.round = round;
        this.prepareEnemySet();
    }

    copy() {
        return {
            enemys: this.enemys.map(enemy => enemy && enemy.copy()),
            aliveEnemyNumber: this.aliveEnemyNumber,
            lengthTraveled: this.lengthTraveled,
        }
    }

    prepareEnemySet() {
        let enemys: Enemy[] = [];
        for (let i = 0; i < 450; i++) {
            enemys.push(new Enemy(this.round.game, Math.ceil(Math.random() * (10 + 2 * this.round.roundNumber)), i));
        }

        this.enemys = enemys;
        this.aliveEnemyNumber = 450;

        let currentQueue: EnemyQueue = {
            enemy: enemys[0],
            next: null,
        }
        this.enemyOnGroundQueue = currentQueue;
        for (let i = 0; i < 450; i++) {
            currentQueue = currentQueue.next = {
                enemy: enemys[i],
                next: null,
            }
        }
    }

    go() {
        this.lengthTraveled += this.speed;
        this.enemyCrossEndLine();
    }

    enemyCrossEndLine() {
        if (this.lengthTraveled < battleGroundDistance) return;

        let targetIndex = Math.ceil(
            (this.lengthTraveled - battleGroundDistance) / (enemySize + enemyYSpace)
        ) * enemyColumn;

        while (this.enemyOnGroundQueue && this.enemyOnGroundQueue.enemy.index < targetIndex) {
            let value = this.enemyOnGroundQueue.enemy.value;
            value && this.aliveEnemyNumber--;
            this.round.game.HP -= value;
            this.round.game.HP < 0 && (this.round.game.HP = 0);
            this.enemyOnGroundQueue.enemy.value = 0;
            this.enemyOnGroundQueue = this.enemyOnGroundQueue.next;
        }
    }

    findEnemyByPoint(x: number, y: number) {
        if ((x - enemyXStartPadding) % (enemyXSpace + enemySize) > enemySize
            || ((y % (enemyYSpace + enemySize) + (this.lengthTraveled % (enemyYSpace + enemySize))) % (enemyYSpace + enemySize) > enemySize)) {
                return null;
        }
    
        let x0 = Math.ceil((x - enemyXStartPadding) / (enemyXSpace + enemySize));
    
        if (x0 < 1 || x0 > 15) {
            return null;
        }
    
        let maybeEnemy = this.enemys[
            enemyColumn * (enemyRow -
                Math.floor((y - this.lengthTraveled + enemyRow * (enemyYSpace + enemySize)) / (enemyYSpace + enemySize))
            ) + x0 - 1
        ];

        if (maybeEnemy && maybeEnemy.value) return maybeEnemy;
        return null;
    }
}
