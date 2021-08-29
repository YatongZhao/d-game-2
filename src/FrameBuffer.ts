import { game } from './game';
import { draw } from './draw';
import { port1 } from './messageChannel';

const stack: {}[] = [];
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
        HP: frame.HP
    });
    game.addConsumedFrameNumber();

    requestAnimationFrame(() => {
        render();
    });
}

const requestRender = () => {
    if (isRenderLoopGoing) return;
    render();
}

/**
 * 每生产一帧，就请求消费循环
 */
export const pushFrame = (frame: {}) => {
    stack.push(frame);
    requestRender();
}

game.addEventListener('message', (ev: any) => {
    if (ev.data.type === 'PUSH_FRAME') {
        pushFrame(ev.data.frame);
    }
});

