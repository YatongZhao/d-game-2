import { Game } from './Game';
import type { heroState } from './Hero';
import type { heroPos, heroType } from './HeroSet';
const game = new Game();

export const startFighting = async () => {
    game.toggleToBattleTurn();
}

export const addConsumedFrameNumber = async () => {
    game.currentRound.addConsumedFrameNumber();
    game.requestPushFrame = true;
    game.pushFrame();
}

export const restartGame = async () => {
    game.restart();
}

export const getOnStageHero = async () => game.onStageHero.stage;

export const hero_stage_get = async (idx: number) => await game.onStageHero.get(idx);
export const hero_stage_set = async (idx: number, maybeHero: heroState|null) => await game.onStageHero.set(idx, maybeHero);
export const hero_stage_delete = async (idx: number) => await game.onStageHero.delete(idx);
export const hero_stage_reset = async () => await game.onStageHero.reset();

export default () => ({
    startFighting,
    addConsumedFrameNumber,
    // moveHero,
    // deleteHero,
    // buyHero,
    restartGame,
    getOnStageHero,
    hero_stage_get,
    hero_stage_set,
    hero_stage_delete,
    hero_stage_reset,
    addEventListener: self.addEventListener,
});
