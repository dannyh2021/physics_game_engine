import * as LinearAlgebra from "../src/math_library/LinearAlgebra";
import Vector3 from "../src/math_library/Vector3";
import Matrix4 from "../src/math_library/Matrix4";

const matrix1 = new Matrix4([
    1, 2, 3, 4,
    2, 3, 4, 5,
    7, 8, 9, 0,
    10, 20, 10, 10
]);

const matrix2 = new Matrix4([
    0, 0, 0, 0,
    1, 1, 1, 1,
    2, 2, 2, 2,
    3, 3, 3, 3
]);

const productMatrix = new Matrix4([
    20, 20, 20, 20,
    26, 26, 26, 26,
    26, 26, 26, 26,
    70, 70, 70, 70
]);

const v1 = new Vector3(1, 2, 3);
const v2 = new Vector3(2, 3, 4);

describe("testing matrix4Product", () => {
    test("checking product", () => {
        expect(LinearAlgebra.matrix4Product(matrix1, matrix2)).toEqual(productMatrix);
    });
});

describe("testing multiplyScalarAndVector3", () => {
    test("components should be equal", () => {
        let result = LinearAlgebra.multiplyScalarAndVector3(2, v1);
        expect(result.x).toBe(2);
        expect(result.y).toBe(4);
        expect(result.z).toBe(6);

        result = LinearAlgebra.multiplyScalarAndVector3(2.5, v2);
        expect(result.x).toBe(5);
        expect(result.y).toBe(7.5);
        expect(result.z).toBe(10);
    });
});

// TODO: test the following functions
// multiplyScalarAndVector
// vector3Sum
// vector3DotProduct
// multiplyMatrix4AndVector3