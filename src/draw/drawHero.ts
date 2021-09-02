import { heroCanvasHeight, heroCanvasWidth, heroInfo, heroSize, HPHeight, HPWidth, isHitHeroPosition, offStageHeroPosition, onStageHeroPosition } from "../const";
import type { Hero } from "../worker/Hero";

class HeroRenderer {
    heroCanvas: HTMLCanvasElement = document.createElement('canvas');
    heroCtx = this.heroCanvas.getContext('2d');
    moveCanvas: HTMLCanvasElement = document.createElement('canvas');
    moveCtx = this.moveCanvas.getContext('2d');

    outHeroCanvas: HTMLCanvasElement[] = [];
    outMoveCanvas: HTMLCanvasElement[] = [];

    currentOnStageHero: (Hero|null)[] = [null, null, null, null, null, null, null, null, null];
    currentOffStageHero: (Hero|null)[] = [null, null, null, null, null, null, null, null, null];

    constructor() {
        this.heroCanvas.width = heroCanvasWidth;
        this.heroCanvas.height = heroCanvasHeight;
        this.moveCanvas.width = heroCanvasWidth;
        this.moveCanvas.height = heroCanvasHeight;
    }

    addOutHeroCanvas(canvas: HTMLCanvasElement) {
        this.outHeroCanvas.push(canvas);
        this.renderOutHero();
    }

    removeOutHeroCanvas(canvas: HTMLCanvasElement) {
        this.outHeroCanvas = this.outHeroCanvas.filter(_canvas => _canvas !== canvas);
    }

    addOutMoveCanvas(canvas: HTMLCanvasElement) {
        this.outMoveCanvas.push(canvas);
        this.renderOutMove();
    }

    removeOutMoveCanvas(canvas: HTMLCanvasElement) {
        this.outMoveCanvas = this.outMoveCanvas.filter(_canvas => _canvas !== canvas);
    }

    renderOutHero() {
        this.outHeroCanvas.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx || !this.heroCtx) return;

            ctx.putImageData(this.heroCtx.getImageData(
                0, 0, heroCanvasWidth, heroCanvasHeight
            ), 0, 0);
        });
    }

    setHero({ onStageHero, offStageHero }: {
        onStageHero: (Hero|null)[];
        offStageHero: (Hero|null)[];
    }) {
        this.diffHero(this.currentOffStageHero, offStageHero, 'off');
        this.diffHero(this.currentOnStageHero, onStageHero, 'on');

        // this.renderOutHero();
    }

    renderOutMove() {
        this.outMoveCanvas.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx || !this.moveCtx) return;

            ctx.putImageData(this.moveCtx.getImageData(
                0, 0, heroCanvasWidth, heroCanvasHeight
            ), 0, 0);
        });
    }

    clearOutMove() {
        const ctx = this.moveCanvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, heroCanvasWidth, heroCanvasHeight);
        this.renderOutMove();
    }

    setMove(hero: Hero, position: {x: number, y: number}) {
        const ctx = this.moveCanvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, heroCanvasWidth, heroCanvasHeight);
        this.requestDrawHero(ctx, null, position);

        this.renderOutMove();
    }

    diffHero(currentHero: (Hero|null)[], inHero: (Hero|null)[], stage: 'on'|'off') {
        const ctx = this.heroCanvas.getContext('2d');
        if (!ctx) return;
    
        currentHero.forEach((hero, i) => {
            let _hero = inHero[i];
            if (!hero && !_hero) return;
            if (hero && _hero
                && hero.id === _hero.id
                && hero.killNumber === _hero.killNumber
                && hero.level === _hero.level) return;
            
            currentHero[i] = _hero;
            let position = (stage === 'on' ? onStageHeroPosition : offStageHeroPosition)[i];
            ctx.clearRect(position.x - heroSize / 2, position.y - heroSize / 2, heroSize, heroSize);
            this.requestDrawHero(ctx, _hero, position);
        });
    }

    requestDrawHero(ctx: CanvasRenderingContext2D, hero: Hero|null, position: {x: number; y: number}) {
        let x = position.x - heroSize / 2;
        let y = position.y - heroSize / 2;
        ctx.strokeRect(x, y, heroSize, heroSize);
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, heroSize, heroSize);
        this.outHeroCanvas.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx || !this.heroCtx) return;

            ctx.putImageData(this.heroCtx.getImageData(
                x - 1, y - 1, heroSize + 2, heroSize + 2
            ), x - 1, y - 1);
        });
    }

    isHitHero(x: number, y: number): Hero|null {
        let heroInfo = isHitHeroPosition(x, y);
        if (!heroInfo) return null;
        let maybeHero = (heroInfo.stage === 'on' ? this.currentOnStageHero : this.currentOffStageHero)[heroInfo.index];
        if (!maybeHero) return null;
        return maybeHero;
    }
}

export const heroRenderer = new HeroRenderer();
