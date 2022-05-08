export default class Matrix4 {
    // assumes the input is length-16 array of numbers
    constructor(private elements: number[]) {
        // TODO: add check for valid input
    }

    // returns element by row and column indices (indices start from 0)
    getElement(i: number, j: number): number {
        return this.elements[i * 4 + j];
    }

    // returns the array of elements
    getElements(): number[] {
        return this.elements;
    }
}