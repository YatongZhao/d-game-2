import { heroCanvasHeight, heroCanvasWidth, heroInfo, heroInfoSet, heroSize, HPHeight, HPWidth, isHitHeroPosition, offStageHeroPosition, onStageHeroPosition } from "../const";
import type { Hero, heroCopy } from "../worker/Hero";

class HeroRenderer {
    heroCanvas: HTMLCanvasElement = document.createElement('canvas');
    heroCtx = this.heroCanvas.getContext('2d');
    moveCanvas: HTMLCanvasElement = document.createElement('canvas');
    moveCtx = this.moveCanvas.getContext('2d');

    outHeroCanvas: HTMLCanvasElement[] = [];
    outMoveCanvas: HTMLCanvasElement[] = [];

    currentOnStageHero: (heroCopy|null)[] = [null, null, null, null, null, null, null, null, null];
    currentOffStageHero: (heroCopy|null)[] = [null, null, null, null, null, null, null, null, null];

    selectedHero: heroCopy|null = null;

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

            if (this.selectedHero) {
                this.clearMovedHero(this.selectedHero);
            }
        });
    }

    setHero({ onStageHero, offStageHero }: {
        onStageHero: (heroCopy|null)[];
        offStageHero: (heroCopy|null)[];
    }) {
        this.diffHero(this.currentOffStageHero, offStageHero, 'off');
        this.diffHero(this.currentOnStageHero, onStageHero, 'on');
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
        this.selectedHero = null;
        const ctx = this.moveCanvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, heroCanvasWidth, heroCanvasHeight);
        this.renderOutMove();
    }

    setMove(hero: heroInfoSet, position: {x: number, y: number}, offset: { offsetX: number, offsetY: number }) {
        this.selectedHero = hero.hero;
        const ctx = this.moveCanvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, heroCanvasWidth, heroCanvasHeight);
        this.requestDrawHero(ctx, hero.hero, {
            x: position.x - offset.offsetX,
            y: position.y - offset.offsetY
        }, this.outMoveCanvas);

        this.renderOutMove();
        this.clearMovedHero(hero.hero as heroCopy);
    }

    diffHero(currentHero: (heroCopy|null)[], inHero: (heroCopy|null)[], stage: 'on'|'off') {
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
            ctx.clearRect(position.x - heroSize / 2 - 1, position.y - heroSize / 2 - 1, heroSize + 2, heroSize + 2);
            this.requestDrawHero(ctx, _hero, position, this.outHeroCanvas);
        });
    }

    clearMovedHero(hero: heroCopy) {
        let stage = 'off';
        let idx = this.currentOffStageHero.findIndex(_hero => _hero === hero);
        if (idx < 0) {
            idx = this.currentOnStageHero.findIndex(_hero => _hero === hero);
            stage = 'on';
        }
        this.outHeroCanvas.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            let position = (stage === 'on' ? onStageHeroPosition : offStageHeroPosition)[idx];
            ctx.clearRect(position.x - heroSize / 2 - 1, position.y - heroSize / 2 - 1, heroSize + 2, heroSize + 2);
        });
    }

    requestDrawHero(ctx: CanvasRenderingContext2D, hero: heroCopy|null, position: {x: number; y: number}, canvasCollect: HTMLCanvasElement[]) {
        let x = position.x - heroSize / 2;
        let y = position.y - heroSize / 2;
        if (hero) {
            ctx.strokeRect(x, y, heroSize, heroSize);
            ctx.fillStyle = 'white';
            ctx.fillRect(x, y, heroSize, heroSize);
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.fillText('' + hero.level, x + heroSize / 2, y + 40);
        }
        canvasCollect.forEach(canvas => {
            const _ctx = canvas.getContext('2d');
            if (!_ctx) return;

            _ctx.putImageData(ctx.getImageData(
                x - 1, y - 1, heroSize + 2, heroSize + 2
            ), x - 1, y - 1);
        });
    }

    isHitHero(x: number, y: number): heroInfoSet|null {
        let heroInfo = isHitHeroPosition(x, y);
        if (!heroInfo) return null;
        let maybeHero = (heroInfo.stage === 'on' ? this.currentOnStageHero : this.currentOffStageHero)[heroInfo.index];
        return {
            hero: maybeHero,
            heroInfo
        };
    }
}

export const heroRenderer = new HeroRenderer();
