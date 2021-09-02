import { battleGroundHeight, battleGroundWidth } from "../const";
import type { Bullet } from "../worker/Bullet";
import type { GrapeshotBullet } from "../worker/GrapeshotBullet";

let bulletCanvas: HTMLCanvasElement;
export const setBulletCanvas = (_canvas: HTMLCanvasElement) => bulletCanvas = _canvas;

export function drawBullet(bullets: GrapeshotBullet[]) {
    const ctx = bulletCanvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, battleGroundWidth, battleGroundHeight);
    bullets.forEach(bullet => {
        let { x, y, direction, speed, size } = bullet;

        ctx.beginPath();
        ctx.moveTo(x, y);
        const dx = Math.round(Math.sin(direction) * speed / 5);
        const dy = Math.round(Math.cos(direction) * speed / 5);
        ctx.lineTo(x - dx, y + dy);
        let gnt1 = ctx.createLinearGradient(x, y, x - dx, y + dy);
        gnt1.addColorStop(0,'red');
        gnt1.addColorStop(1,'white');
        ctx.lineWidth = size;
        ctx.strokeStyle = gnt1;
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
    });
}