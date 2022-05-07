import { Vector4 } from "../src/math_library/Vector4";

describe("testing Vector4", () => {
    let v = new Vector4(1, 1, 1, 0);
    test("components should be equal", () => {
        expect(v.x).toBe(1);
        expect(v.w).toBe(0);
    });
});