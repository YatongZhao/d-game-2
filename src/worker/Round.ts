import { EnemySet } from "./EnemySet";
import type { Game } from "./Game";
import { GrapeshotHero } from "./GrapeshotHero";
import type { Hero } from "./Hero";

/**
 * 关卡
 * 
 * 每个关卡的初始化准备工作：
 * 1. 准备enemy
 * 2. 准备hero，因为heroState只是一些数据，需要被实例化
 */
export class Round {
    enemySet: EnemySet;
    game: Game;
    isWorkLoopRunning = false;
    roundNumber = 0;
    heroSet: Hero[] = [];
    heroMap: { [id: string]: Hero } = {};

    isRoundBegin = false;

    producedFrameNumber = 0;
    consumedFrameNumber = 0;

    constructor(game: Game, roundNumber: number) {
        this.game = game;
        this.roundNumber = roundNumber;
        this.enemySet = new EnemySet(this);
    }

    initialHeroSet() {
        this.heroSet = this.game.onStageHero.stage
            .map((heroState) => {
                if (!heroState) return null;
                
                let hero;
                switch (heroState.type) {
                    case 'grapeshotHero':
                    default:
                        hero = GrapeshotHero.fromPosition(this.game, { x: 0, y: 0, });
                }
                hero.patchState(heroState);
                return hero;
            }).filter(Boolean) as Hero[];

        this.heroMap = this.heroSet.reduce((pre, current) => {
            return {
                ...pre,
                [current.id]: current,
            };
        }, {});
    }

    syncHeroState() {
        
        if (this.isRoundBegin) {
            this.game.onStageHero.stage = this.game.onStageHero.stage.map(heroState => {
                if (!heroState) return null;
    
                return this.heroMap[heroState.id].produceState();
            });
        }

        return this.game.onStageHero.stage;
    }

    startBattle() {
        this.isRoundBegin = true;
        this.producedFrameNumber = 0;
        this.consumedFrameNumber = 0;
        this.initialHeroSet();
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
                // this.game.heroSet.go();
                this.heroSet.forEach(hero => hero.go());
            }
            this.game.bulletSet.go();

            this.game.produceFrame();
            this.producedFrameNumber++;

            if (this.game.HP <= 0) {
                break;
            }
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
        
        this.syncHeroState();
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