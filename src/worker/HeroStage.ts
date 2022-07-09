import type { heroState } from "./Hero";

/**
 * 
 */
export class HeroStage {
    stage: (heroState|null)[] = [null, null, null, null, null, null, null, null, null];
    private positionList: { x: number; y: number; }[];

    constructor(positionList: { x: number; y: number; }[]) {
        this.positionList = positionList;
    }

    get(idx: number) {
        return this.stage[idx];
    }

    /**
     * 
     * @param idx 
     * @param maybeHero 
     * @returns 此位置之前的`heroState`
     */
    set(idx: number, maybeHero: heroState|null) {
        const oldHero = this.stage[idx];
        this.stage[idx] = maybeHero;
        if (maybeHero) {
            maybeHero.x = this.positionList[idx].x;
            maybeHero.y = this.positionList[idx].y;
        }

        return oldHero;
    }

    /**
     * 
     * @param idx 
     * @returns 删除的`heroState`
     */
    delete(idx: number) {
        return this.set(idx, null);
    }

    exchange(idx1: number, idx2: number) {
        let temp = this.stage[idx1];
        this.set(idx1, this.stage[idx2]);
        this.set(idx2, temp);
    }

    reset() {
        this.stage = this.stage.map(_ => null);
    }
}
