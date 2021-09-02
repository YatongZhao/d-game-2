import { game } from './game';
import { draw } from './draw';
import { port1 } from './messageChannel';
import { heroRenderer } from './draw/drawHero';
import { drawBullet } from './draw/drawBullet';

let stack: {}[] = [];
let isRenderLoopGoing = false;

const render = () => {
    isRenderLoopGoing = true;
    const frame = stack.shift() as any;

    if (!frame) {
        isRenderLoopGoing = false;
        return;
    }
    draw(frame);
    port1.postMessage({
        HP: frame.HP,
        roundNumber: frame.roundNumber,
    });
    heroRenderer.setHero({
        onStageHero: frame.onStageHero,
        offStageHero: frame.offStageHero,
    });
    drawBullet(frame.bullets);
    game.addConsumedFrameNumber();

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

