import Vector3 from "../src/math_library/Vector3";

describe("Vector3 constructor", () => {
    let v = new Vector3(1, 2, 3);
    test("components should be equal", () => {
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
    });

    console.log("hi");
});

// TODO: complete tests below
// Vector3 magnitude
// Vector3 squaredMagnitude
// Vector3 normalize
// Vector3 invert
// Vector3 addVector
// Vector3 addScaledVector
// Vector3 setComponents
// Vector3 multiplyScalar
// Vector3 clone
// Vector3