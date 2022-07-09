import { init$, initHP, onStageHeroPosition } from "../const";
import type { Bullet } from "./Bullet";
import { BulletSet } from "./BulletSet";
import type { EnemySet, enemySetCopy } from "./EnemySet";
import { FrameCounter } from "./frameCounter";
import type { Hero, heroState } from "./Hero";
import { HeroSet } from "./HeroSet";
import { HeroStage } from "./HeroStage";
import { Round } from "./Round";

export type currentTurn = 'BATTLE_TURN'|'STRATEGY_TURN';

export type frame = {
    currentTurn: currentTurn;
    HP: number;
    enemys: enemySetCopy;

    newOnStageHero: (heroState|null)[];

    bullets: any[];
    roundNumber: number;
    $: number;
    bufferFrameNumber: number;
    isGameOver: boolean;
}

export class Game {
    onStageHero = new HeroStage(onStageHeroPosition);
    // heroSet = new HeroSet(this);
    bulletSet = new BulletSet();
    currentRound = new Round(this, 1);
    frameCounter = new FrameCounter();
    frameBuffer: frame[] = [];
    requestPushFrame = false;

    isGameOver = false;

    currentTurn: currentTurn = 'STRATEGY_TURN';

    HP = initHP;
    $ = init$;
    score = 0;

    constructor() {
        this.initial();
    }

    initial() {
        this.bulletSet = new BulletSet();
        this.currentRound = new Round(this, 1);
        this.frameCounter = new FrameCounter();
        this.frameBuffer = [];
        this.requestPushFrame = false;

        this.isGameOver = false;

        this.currentTurn = 'STRATEGY_TURN';

        this.HP = initHP;
        this.$ = init$;
        this.score = 0;

        this.produceFrame();
        this.pushFrame();
    }

    restart() {
        this.initial();
    }

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
        this.frameBuffer.push({
            currentTurn: this.currentTurn,
            HP: this.HP,
            enemys: this.currentRound.enemySet.copy(),

            newOnStageHero: this.currentRound.syncHeroState(),

            bullets: this.bulletSet.copy(),
            roundNumber: this.currentRound.roundNumber,
            $: this.$,
            bufferFrameNumber: this.currentRound.producedFrameNumber - this.currentRound.consumedFrameNumber,
            isGameOver: this.isGameOver,
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
