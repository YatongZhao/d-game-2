import { Game } from './Game';
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

export const moveHero = async (pos1: heroPos, pos2: heroPos) => {
    game.heroSet.move(pos1, pos2);
    return {
        onStageHero: game.heroSet.copyOnStageHero(),
        offStageHero: game.heroSet.copyOffStageHero(),
    }
}

export const deleteHero = async (id: string) => {
    game.heroSet.delete(id);
    return {
        onStageHero: game.heroSet.copyOnStageHero(),
        offStageHero: game.heroSet.copyOffStageHero(),
    }
}

export const buyHero = async (heroType: heroType) => {
    game.heroSet.add(heroType);
    game.heroSet.operationTime++;
    if (game.currentTurn === 'STRATEGY_TURN') {
        game.requestPushFrame = true;
        game.produceFrame();
    }
}

export const restartGame = async () => {
    game.restart();
}

export default () => ({
    startFighting,
    addConsumedFrameNumber,
    moveHero,
    deleteHero,
    buyHero,
    restartGame,
    addEventListener: self.addEventListener,
});
