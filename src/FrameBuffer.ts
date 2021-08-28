import { game } from './game';
import { draw } from './draw';

const stack: {}[] = [];
let isRenderLoopGoing = false;

const render = () => {
    isRenderLoopGoing = true;
    const frame = stack.shift();

    if (!frame) {
        isRenderLoopGoing = false;
        return;
    }
    draw(frame);
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

