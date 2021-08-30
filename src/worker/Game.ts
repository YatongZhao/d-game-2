import { BulletSet } from "./BulletSet";
import { FrameCounter } from "./frameCounter";
import { HeroSet } from "./HeroSet";
import { Round } from "./Round";

export class Game {
    heroSet = new HeroSet(this);
    bulletSet = new BulletSet();
    currentRound = new Round(this);
    frameCounter = new FrameCounter();

    currentTurn: 'BATTLE_TURN'|'STRATEGY_TURN' = 'STRATEGY_TURN';

    HP = 1000;
    $ = 500;

    toggleToBattleTurn() {
        console.log('toggleToBattleTurn');
        if (this.currentTurn === 'BATTLE_TURN') return;
        this.currentTurn = 'BATTLE_TURN';
        this.currentRound.startBattle();
    }

    toggleToStrategyTurn() {
        if (this.currentTurn === 'STRATEGY_TURN') return;
        this.currentTurn = 'STRATEGY_TURN';
    }

    produceFrame() {
        self.postMessage({
            type: 'PUSH_FRAME',
            frame: {
                HP: this.HP,
                enemys: this.currentRound.enemySet,
                onStageHero: this.heroSet.onStageHero,
                offStageHero: this.heroSet.offStageHero,
            },
        });
    }
}
