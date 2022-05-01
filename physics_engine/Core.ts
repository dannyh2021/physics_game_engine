

export class Vector4 {
    public x: Number;
    public y: Number;
    public z: Number;
    public w: Number;

    constructor(x: Number, y: Number, z: Number, w: Number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    print() {
        console.log("this.x: ", this.x);
    }
}