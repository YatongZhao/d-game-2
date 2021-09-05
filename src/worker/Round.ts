import { EnemySet } from "./EnemySet";
import type { Game } from "./Game";

export class Round {
    enemySet: EnemySet;
    game: Game;
    isWorkLoopRunning = false;
    roundNumber = 0;

    producedFrameNumber = 0;
    consumedFrameNumber = 0;

    constructor(game: Game, roundNumber: number) {
        this.game = game;
        this.roundNumber = roundNumber;
        this.enemySet = new EnemySet(this);
    }

    startBattle() {
        this.producedFrameNumber = 0;
        this.consumedFrameNumber = 0;
        this.battleTurnWorkLoop();
    }

    async battleTurnWorkLoop() {
        this.isWorkLoopRunning = true;
        while (!this.isBattleToTheEnd()) {
            this.game.frameCounter.add();
            if (this.enemySet.lengthTraveled < 300) {
                this.enemySet.speed = Math.floor((300 - this.enemySet.lengthTraveled) / 6) + 1;
                this.enemySet.go();
                this.game.produceFrame();
                this.producedFrameNumber++;
                if (this.enemySet.lengthTraveled >= 300){
                    this.enemySet.speed = EnemySet.initSpeed;
                }
                await timeoutPromise();

                if (this.shouldPause()) {
                    this.isWorkLoopRunning = false;
                    return;
                }
                continue;
            }

            this.enemySet.go();
            if (this.enemySet.aliveEnemyNumber !== 0) {
                this.game.heroSet.go();
            }
            this.game.bulletSet.go();

            this.game.produceFrame();
            this.producedFrameNumber++;
            await timeoutPromise();

            if (this.shouldPause()) {
                this.isWorkLoopRunning = false;
                return;
            }
        }

        if (this.game.HP <= 0) {
            this.game.isGameOver = true;
        } else {
            this.game.currentRound = new Round(this.game, this.roundNumber + 1);
        }
        
        this.game.toggleToStrategyTurn();
        this.game.produceFrame();
        this.isWorkLoopRunning = false;
    }

    addConsumedFrameNumber() {
        this.consumedFrameNumber++;
        if (!this.isWorkLoopRunning && this.game.currentTurn === 'BATTLE_TURN') {
            this.battleTurnWorkLoop();
        }
    }

    shouldPause() {
        return this.producedFrameNumber - this.consumedFrameNumber > 200;
    }

    isBattleToTheEnd() {
        return (this.game.HP <= 0 || this.enemySet.aliveEnemyNumber <= 0)
            && this.game.bulletSet.bullets.length <= 0;
    }
}

function timeoutPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(null), 0);
    });
}