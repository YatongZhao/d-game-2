import type { Bullet } from "./Bullet";
import { BulletSet } from "./BulletSet";
import type { EnemySet } from "./EnemySet";
import { FrameCounter } from "./frameCounter";
import type { Hero } from "./Hero";
import { HeroSet } from "./HeroSet";
import { Round } from "./Round";

export class Game {
    heroSet = new HeroSet(this);
    bulletSet = new BulletSet();
    currentRound = new Round(this);
    frameCounter = new FrameCounter();
    frameBuffer: {
        HP: number;
        enemys: EnemySet;
        onStageHero: (Hero|null)[];
        offStageHero: (Hero|null)[];
        bullets: Bullet[];
    }[] = [];
    requestPushFrame = false;

    currentTurn: 'BATTLE_TURN'|'STRATEGY_TURN' = 'STRATEGY_TURN';

    HP = 1000;
    $ = 500;
    score = 0;

    toggleToBattleTurn() {
        if (this.currentTurn === 'BATTLE_TURN') return;
        this.requestPushFrame = true;
        this.currentTurn = 'BATTLE_TURN';
        this.currentRound.startBattle();
    }

    toggleToStrategyTurn() {
        if (this.currentTurn === 'STRATEGY_TURN') return;
        this.currentTurn = 'STRATEGY_TURN';
    }

    produceFrame() {
        // self.postMessage({
        //     type: 'PUSH_FRAME',
        //     frame: {
        //         HP: this.HP,
        //         enemys: this.currentRound.enemySet,
        //         onStageHero: this.heroSet.onStageHero,
        //         offStageHero: this.heroSet.offStageHero,
        //         bullets: this.bulletSet.bullets,
        //     },
        // });
        this.frameBuffer.push({
            HP: this.HP,
            enemys: this.currentRound.enemySet,
            onStageHero: this.heroSet.onStageHero,
            offStageHero: this.heroSet.offStageHero,
            bullets: this.bulletSet.bullets,
        });
        if (this.requestPushFrame) {
            this.pushFrame();
        }
    }

    pushFrame() {
        if (this.frameBuffer.length === 0) return;
        self.postMessage({
            type: 'PUSH_FRAMES',
            frames: this.frameBuffer,
        });
        this.frameBuffer = [];
        this.requestPushFrame = false;
    }
}
