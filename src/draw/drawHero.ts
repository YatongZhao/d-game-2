import { HPHeight, HPWidth, offStageHeroPosition, onStageHeroPosition } from "../const";
import type { Hero } from "../worker/Hero";

let heroCanvas: HTMLCanvasElement;
export const setHeroCanvas = (_canvas: HTMLCanvasElement) => heroCanvas = _canvas;

const currentOnStageHero: (Hero|null)[] = [null, null, null, null, null, null, null, null, null];
const currentOffStageHero: (Hero|null)[] = [null, null, null, null, null, null, null, null, null];

export const setHero = ({ onStageHero, offStageHero }: {
    onStageHero: (Hero|null)[];
    offStageHero: (Hero|null)[];
}) => {
    diffHero(currentOffStageHero, offStageHero, 'off');
    diffHero(currentOnStageHero, onStageHero, 'on');
}

const diffHero = (currentHero: (Hero|null)[], inHero: (Hero|null)[], stage: 'on'|'off') => {
    currentHero.forEach((hero, i) => {
        let _hero = inHero[i];
        if (!hero && !_hero) return;
        if (hero && _hero
            && hero.id === _hero.id
            && hero.killNumber === _hero.killNumber
            && hero.level === _hero.level) return;
        
        currentHero[i] = _hero;
        requestDrawHero(_hero, stage, i);
    });
}

const requestDrawHero = (hero: Hero|null, stage: 'on'|'off', index: number) => {
    let position = (stage === 'on' ? onStageHeroPosition : offStageHeroPosition)[index];

    const ctx = heroCanvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeRect(position.x - 40, position.y - 40, 80, 80);
    ctx.stroke();
}

