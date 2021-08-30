import type { Bullet } from "./Bullet";

export class BulletSet {
    bullets: Bullet[] = [];

    go() {
        this.bullets = this.bullets.filter(bullet => {
            if (bullet.isDied) return false;
            bullet.go();
            return true;
        });
    }

    add(bullet: Bullet) {
        this.bullets.push(bullet);
    }
}
