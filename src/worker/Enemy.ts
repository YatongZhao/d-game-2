export class Enemy {
    value = 0;
    index = 0;

    constructor(value: number, index: number) {
        this.value = value;
        this.index = index;
    }
}

export type EnemyQueue = {
    enemy: Enemy;
    next: EnemyQueue|null;
}
