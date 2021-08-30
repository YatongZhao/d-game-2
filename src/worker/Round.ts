import { EnemySet } from "./EnemySet";
import type { Game } from "./Game";

export class Round {
    enemySet: EnemySet;
    game: Game;
    isWorkLoopRunning = false;

    producedFrameNumber = 0;
    consumedFrameNumber = 0;

    constructor(game: Game) {
        this.game = game;
        this.enemySet = new EnemySet(this);
    }

    startBattle() {
        this.battleTurnWorkLoop();
    }

    async battleTurnWorkLoop() {
        this.isWorkLoopRunning = true;
        while (!this.isBattleToTheEnd()) {
            this.game.frameCounter.add();

            this.enemySet.go();
            this.game.heroSet.go();
            this.game.bulletSet.go();

            this.game.produceFrame();
            this.producedFrameNumber++;
            await Promise.resolve();

            if (this.producedFrameNumber - this.consumedFrameNumber > 2) {
                this.isWorkLoopRunning = false;
                return;
            }
        }

        this.game.toggleToStrategyTurn();
        this.isWorkLoopRunning = false;
    }

    addConsumedFrameNumber() {
        this.consumedFrameNumber++;
        if (!this.isWorkLoopRunning) {
            this.battleTurnWorkLoop();
        }
    }

    isBattleToTheEnd() {
        return this.game.HP <= 0 || this.enemySet.aliveEnemyNumber <= 0;
    }
}
