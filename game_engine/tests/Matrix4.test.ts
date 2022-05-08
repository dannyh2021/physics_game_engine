import Matrix4 from "../src/math_library/Matrix4";

const elements = [
    1, 2, 3, 4,
    2, 3, 4, 5,
    7, 8, 9, 0,
    10, 20, 10, 10
];

const elements2 = [
    0, 0, 0, 0,
    1, 1, 1, 1,
    2, 2, 2, 2,
    3, 3, 3, 3
];

describe("Matrix4 constructor and getElements", () => {
    let matrix = new Matrix4(elements);
    test("elements should be equal to original input elements", () => {
        expect(matrix.getElements()).toEqual(elements);
        expect(matrix.getElements()).not.toEqual(elements2);
    });
});

describe("Matrix4 getElement", () => {
    let matrix = new Matrix4(elements);
    test("getElement(i, j) should equal corresponding input elements", () => {
        expect(matrix.getElement(0, 0)).toBe(1);
        expect(matrix.getElement(0, 1)).toBe(2);
        expect(matrix.getElement(0, 2)).toBe(3);
        expect(matrix.getElement(0, 3)).toBe(4);

        expect(matrix.getElement(2, 0)).toBe(7);
        expect(matrix.getElement(2, 3)).toBe(0);

        expect(matrix.getElement(3, 3)).toBe(10);
    });
});