import { HPHeight, HPWidth } from "../const";

let HPCanvas: HTMLCanvasElement;
export const setHPCanvas = (_canvas: HTMLCanvasElement) => HPCanvas = _canvas;

let HP = 1000;
let renderHP = 1000;
let isDrawHPLoopRunning = false;

export const setHP = (_HP: number) => {
    HP = _HP;
    if (isDrawHPLoopRunning) return;
    requestDrawHP();
}

const requestDrawHP = () => {
    isDrawHPLoopRunning = true;
    requestAnimationFrame(() => {
        drawHP();
    });
}
export const drawHP = () => {
    if (renderHP > HP) {
        let diff = renderHP - HP;
        renderHP -= Math.floor(diff * 0.1) + 2;
        renderHP < HP && (renderHP = HP);
    }
    const HPCtx = HPCanvas.getContext('2d');
    if (!HPCtx) return;
    HPCtx.clearRect(0, 0, HPWidth, HPHeight);
    HPCtx.fillStyle = 'lightgreen';
    HPCtx.fillRect(
        HPWidth - renderHP, 0, renderHP, HPHeight
    );
    HPCtx.stroke();
    HPCtx.fillStyle = 'green';
    HPCtx.fillRect(
        HPWidth - HP, 0, HP, HPHeight
    );
    HPCtx.stroke();

    if (renderHP !== HP) {
        requestDrawHP();
    } else {
        isDrawHPLoopRunning = false;
    }
}
