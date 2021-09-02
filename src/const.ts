import type { Hero } from "./worker/Hero";

export const battleGroundDistance = 1700;
export const battleGroundWidth = 1000;

export const heroCanvasHeight = 300;
export const heroCanvasWidth = 1000;

export const battleGroundHeight = battleGroundDistance + heroCanvasHeight;
export const enemySize = 50;
export const enemyYSpace = 15;
export const enemyXSpace = 15;
export const enemyXStartPadding = 15;
export const enemyColumn = 15;
export const enemyRow = 30;

export const HPWidth = 1000;
export const HPHeight = 36;

function createAverageList(width: number, num: number, space: number): number[] {
    let startSpace = (width - space * (num - 1)) / 2;

    let result = [];
    let count = startSpace;
    for (let i = 0; i < num; i++) {
        result.push(count);
        count += space;
    }

    return result;
}
let heroXList = createAverageList(1000, 9, 106);

export const onStageHeroPosition = heroXList.map((x, i) => ({ x, y: 70 }));
export const offStageHeroPosition = heroXList.map((x, i) => ({ x, y: 175 }));
export const heroSize = 80;
export const hitSize = 120;

export type heroInfo = {
    stage: 'on'|'off';
    index: number;
}

export type heroInfoSet = {
    hero: Hero|null;
    heroInfo: heroInfo;
}

export const isHitHeroPosition = (x: number, y: number): heroInfo|null => {
    let index = onStageHeroPosition.findIndex(({x: _x, y: _y}) => {
        let dx = x - _x;
        let dy = y - _y;
        return dx > -hitSize / 2 && dx < hitSize / 2
            && dy > -hitSize / 2 && dy < hitSize / 2;
    });
    if (index >= 0) return { stage: 'on', index };
    index = offStageHeroPosition.findIndex(({x: _x, y: _y}) => {
        let dx = x - _x;
        let dy = y - _y;
        return dx > -hitSize / 2 && dx < hitSize / 2
            && dy > -hitSize / 2 && dy < hitSize / 2;
    });
    if (index >= 0) return { stage: 'off', index };
    return null;
}
