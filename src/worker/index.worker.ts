import { Game } from './Game';
import type { heroPos } from './HeroSet';
const game = new Game();

export const startFighting = async () => {
    game.toggleToBattleTurn();
}

export const addConsumedFrameNumber = async () => {
    game.currentRound.addConsumedFrameNumber();
    game.requestPushFrame = true;
    game.pushFrame();
}

export const moveHero = async (pos1: heroPos, pos2: heroPos) => {
    game.heroSet.move(pos1, pos2);
    return {
        onStageHero: game.heroSet.copyOnStageHero(),
        offStageHero: game.heroSet.copyOffStageHero(),
    }
}

export default () => ({
    startFighting,
    addConsumedFrameNumber,
    moveHero,
    addEventListener: self.addEventListener,
});
