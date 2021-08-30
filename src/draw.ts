import { battleGroundDistance, battleGroundHeight, battleGroundWidth, enemySize, enemyXSpace, enemyXStartPadding, enemyYSpace, HPHeight, HPWidth } from "./const";

let canvas: HTMLCanvasElement;
export const setCanvas = (_canvas: HTMLCanvasElement) => canvas = _canvas;


const getIndex = (row: number, column: number) => {
    return row * 15 + column;
}
export const draw = (frame: any) => {
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.clearRect(0, 0, battleGroundWidth, battleGroundHeight);
    
    for (let row = 0; row < 30; row++) {
        for (let col = 0; col < 15; col++) {
            const idx = getIndex(row, col);
            const value = frame.enemys.enemys[idx].value;
            if (value === 0) {
                continue;
            }
            const x = (col * (enemySize + enemyXSpace) + enemyXStartPadding);
            const y = (row * (-enemySize - enemyYSpace) + frame.enemys.lengthTraveled);
            
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.fillRect(
                x, y, enemySize, enemySize
            )
            ctx.fillStyle = 'black';
            ctx.fillText(`${frame.enemys.enemys[idx].value}`, x + 25, y + 36);
            ctx.strokeRect(
                x,
                y,
                enemySize,
                enemySize
            );
        }
    }

    ctx.stroke();
}
