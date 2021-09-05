import { game } from './game';
import { draw } from './draw';
import { port1 } from './messageChannel';
import { heroRenderer } from './draw/drawHero';
import { drawBullet } from './draw/drawBullet';
import type { frame } from './worker/Game';
import { heroShop } from './HeroShop';

let stack: {}[] = [];
let isRenderLoopGoing = false;
let currentFrame: frame;

function mergeFrame(frame: frame) {
    let frameHeroSetOperationTime = frame.heroSetOperationTime;
    let heroShopOperationTime = heroShop.heroSetOperationTime;
    let diff = heroShopOperationTime - frameHeroSetOperationTime;
    if (diff === 0) return;
    while (diff < heroShop.operationStack.length) {
        heroShop.operationStack.shift();
    }
    if (heroShop.operationStack.length === 0) return;
    heroShop.operationStack.forEach(operation => {
        frame.offStageHero[operation.position] = operation.hero;
    });
}

const render = () => {
    isRenderLoopGoing = true;
    const frame = stack.shift() as frame;

    if (!frame) {
        isRenderLoopGoing = false;
        return;
    }
    mergeFrame(frame);
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
        onStageHero: frame.onStageHero,
        offStageHero: frame.offStageHero,
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