import type { Bullet } from "./Bullet";

export class BulletSet {
    bullets: Bullet[] = [];

    add(bullet: Bullet) {
        this.bullets.push(bullet);
    }
}
