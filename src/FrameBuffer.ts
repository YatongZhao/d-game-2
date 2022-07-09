import { game } from './game';
import { draw } from './draw/drawEnemy';
import { port1 } from './messageChannel';
import { heroRenderer } from './draw/drawHero';
import { drawBullet } from './draw/drawBullet';
import type { frame } from './worker/Game';
import { heroShop } from './HeroShop';
import { heroManager } from './HeroManager';

let stack: {}[] = [];
let isRenderLoopGoing = false;
let currentFrame: frame;

const render = () => {
    isRenderLoopGoing = true;
    const frame = stack.shift() as frame;

    if (!frame) {
        isRenderLoopGoing = false;
        return;
    }
    draw(frame);
    port1.postMessage({
        currentTurn: frame.currentTurn,
        HP: frame.HP,
        roundNumber: frame.roundNumber,
        $: frame.$,
        bufferFrameNumber: frame.bufferFrameNumber,
        isGameOver: frame.isGameOver,
    });
    heroRenderer.setHero({
        onStageHero: frame.newOnStageHero,
        offStageHero: heroManager.offstageHero.stage,
    });
    drawBullet(frame.bullets);
    game.addConsumedFrameNumber();
    currentFrame = frame;

    requestAnimationFrame(() => {
        render();
    });
}

const requestRender = () => {
    if (isRenderLoopGoing) return;
    render();
}

const pushFrames = (frames: {}[]) => {
    stack = stack.concat(frames);
    requestRender();
}

game.addEventListener('message', (ev: any) => {
    if (ev.data.type === 'PUSH_FRAMES') {
        pushFrames(ev.data.frames);
    }
});

export const getCurrentFrame = (): frame => currentFrame;