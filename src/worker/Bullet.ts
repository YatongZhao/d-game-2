export class Bullet {
    isDied = false;

    go() {}

    copy(): any {
        return { isDied: this.isDied };
    }
}
