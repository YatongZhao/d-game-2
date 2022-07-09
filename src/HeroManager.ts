import { heroInfo, offStageHeroPosition } from "./const";
import { game } from "./game";
import type { heroState } from "./worker/Hero";
import { HeroStage } from "./worker/HeroStage";

class HeroManager {
    offstageHero: HeroStage = new HeroStage(offStageHeroPosition);

    private getHeroStage(stage: 'on' | 'off') {
        switch (stage) {
            case 'on':
                return {
                    get: game.hero_stage_get,
                    set: game.hero_stage_set,
                    delete: game.hero_stage_delete,
                    reset: game.hero_stage_reset,
                }
            case 'off':
            default:
                return this.offstageHero;
        }
    }

    async addHero(maybeHero: heroState|null, pos: heroInfo) {
        const heroStage = this.getHeroStage(pos.stage);
        return await heroStage.set(pos.index, maybeHero);
    }

    async deleteHero(pos: heroInfo) {
        const heroStage = this.getHeroStage(pos.stage);
        return await heroStage.delete(pos.index);
    }

    async move(pos1: heroInfo, pos2: heroInfo) {
        const heroStage1 = this.getHeroStage(pos1.stage);
        const heroStage2 = this.getHeroStage(pos2.stage);

        const tempHero = await heroStage1.set(pos1.index, await heroStage2.get(pos2.index));
        await heroStage2.set(pos2.index, tempHero);
    }

    async getAll() {
        return {
            onStageHero: await game.getOnStageHero(),
            offStageHero: this.offstageHero.stage,
        };
    }

    findAddHeroIndex() {
        return this.offstageHero.stage.findIndex(hero => !hero);
    }

    async reset() {
        this.offstageHero.reset();
        await game.hero_stage_reset();
    }
}

export const heroManager = new HeroManager();
