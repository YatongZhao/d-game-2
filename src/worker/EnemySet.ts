import { battleGroundDistance, enemyColumn, enemyRow, enemySize, enemyXSpace, enemyXStartPadding, enemyYSpace } from "../const";
import { Enemy, EnemyQueue } from "./Enemy";
import type { Round } from "./Round";

export class EnemySet {
    enemys: Enemy[] = [];
    aliveEnemyNumber = 0;
    enemyOnGroundQueue: EnemyQueue|null = null;
    lengthTraveled = 0;
    speed = 5;
    endLineIndex = 0;
    round: Round;

    constructor(round: Round) {
        this.round = round;
        this.prepareEnemySet();
    }

    prepareEnemySet() {
        let enemys: Enemy[] = [];
        for (let i = 0; i < 450; i++) {
            enemys.push(new Enemy(Math.ceil(Math.random() * 10), i));
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
            this.round.game.HP -= value;
            this.round.game.HP < 0 && (this.round.game.HP = 0);
            this.enemyOnGroundQueue.enemy.value = 0;
            this.aliveEnemyNumber--;
            this.enemyOnGroundQueue = this.enemyOnGroundQueue.next;
        }
    }

    findEnemyByPoint(x: number, y: number) {
        if ((x - enemyXStartPadding) % (enemyXSpace + enemySize) > enemySize
            || (y + (this.lengthTraveled % (enemyYSpace + enemySize))) % (enemyYSpace + enemySize) > enemySize) {
                return null;
        }
    
        let x0 = Math.ceil((x - enemyXStartPadding) / (enemyXSpace + enemySize));
    
        if (x0 < 1 || x0 > 15) {
            return null;
        }
    
        return this.enemys[
            enemyColumn * (enemyRow -
                Math.ceil((y - this.lengthTraveled + enemyRow * (enemyYSpace + enemySize)) / (enemyYSpace + enemySize))
            ) + x0
        ];
    }
}
