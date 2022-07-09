import { heroInfo, refresh$ } from "./const";
import { heroRenderer } from "./draw/drawHero";
import { heroManager } from "./HeroManager";
import { createHeroState, heroState } from "./worker/Hero";
import type { heroType } from "./worker/HeroSet";

export type heroItem = {
    type: heroType;
    name: string;
    $: number;
}

const grapeshotHeroItem = {
    type: 'grapeshotHero',
    name: '霰弹',
    $: 300,
    sold$: [250, 500, 1000],
}

export const heroMap: { [key: string]: {
    type: string;
    name: string;
    $: number;
    sold$: number[];
} } = {
    grapeshotHero: grapeshotHeroItem,
}

class HeroShop {
    heroList: (heroItem|null)[] = new Array(5).fill(grapeshotHeroItem);
    $ = 0;
    costed$ = 0;
    refresh$ = refresh$;
    heroSetOperationTime = 0;
    operationStack: {
        position: number;
        hero: heroState;
    }[] = [];

    reset() {
        this.setCosted$(-this.costed$);
        this.heroSetOperationTime = 0;
        this.operationStack = [];
        this.heroList = new Array(5).fill(grapeshotHeroItem);
    }

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

    async buy(index: number) {
        let position = heroManager.findAddHeroIndex();
        if (position < 0) return;
        let maybeHero = this.heroList[index];
        if (!maybeHero) return;
        if (this.get$() < maybeHero.$) return;
        this.setCosted$(maybeHero.$);
        this.heroList[index] = null;

        await heroManager.addHero(createHeroState(maybeHero.type), {
            stage: 'off', index: position
        });
        heroRenderer.setHero(await heroManager.getAll());
    }

    async sell(heroState: heroState, heroInfo: heroInfo) {
        const { id, type, level } = heroState;
        this.setCosted$(-heroMap[type].sold$[level - 1]);
        await heroManager.deleteHero(heroInfo);
        heroRenderer.setHero(await heroManager.getAll());
    }
}

export const heroShop = new HeroShop;
