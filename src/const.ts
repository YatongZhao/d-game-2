export const battleGroundDistance = 2000;
export const battleGroundWidth = 1000;

export const heroCanvasHeight = 320;
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
export const offStageHeroPosition = heroXList.map((x, i) => ({ x, y: 225 }));
