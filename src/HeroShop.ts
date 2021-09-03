import { offStageHeroPosition } from "./const";
import { getCurrentFrame } from "./FrameBuffer";
import { game } from "./game";
import type { Hero, heroCopy } from "./worker/Hero";
import { findAddHeroIndex, heroType } from "./worker/HeroSet";

export type heroItem = {
    type: heroType;
    name: string;
    $: number;
}

const grapeshotHeroItem = {
    type: 'grapeshotHero',
    name: '霰弹',
    $: 300,
}

class HeroShop {
    heroList: (heroItem|null)[] = new Array(5).fill(grapeshotHeroItem);
    $ = 0;
    costed$ = 0;
    refresh$ = 20;
    heroSetOperationTime = 0;
    operationStack: {
        position: number;
        hero: heroCopy;
    }[] = [];

    refresh() {
        if (this.get$() < this.refresh$) return;
        this.heroList = new Array(5).fill(grapeshotHeroItem);
        this.setCosted$(this.refresh$);
    }

    set$($: number) {
        this.$ = $;
    }

    get$() {
        return this.$ - this.costed$;
    }

    setCosted$($: number) {
        this.costed$ += $;
    }

    buy(index: number) {
        let position = findAddHeroIndex(getCurrentFrame().offStageHero);
        if (position < 0) return;
        let maybeHero = this.heroList[index];
        if (!maybeHero) return;
        if (this.get$() < maybeHero.$) return;
        this.setCosted$(maybeHero.$);
        this.heroList[index] = null;

        this.operationStack.push({
            position,
            hero: {
                level: 1,
                killNumber: 0,
                id: '',
                ...offStageHeroPosition[position]
            }
        });
        game.buyHero(maybeHero.type);
        this.heroSetOperationTime++;
    }
}

export const heroShop = new HeroShop;
