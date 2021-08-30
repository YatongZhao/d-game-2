import { Game } from './Game';
const game = new Game();

export const startFighting = async () => {
    game.toggleToBattleTurn();
}

export const addConsumedFrameNumber = async () => {
    game.currentRound.addConsumedFrameNumber();
}

export default () => ({
    startFighting,
    addConsumedFrameNumber,
    addEventListener: self.addEventListener,
});
