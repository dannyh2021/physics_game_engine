import Matrix4 from "./Matrix4";
import Vector3 from "./Vector3";

/**
 * Returns product of two Matrix4's.
 * @param {!Matrix4} a left matrix
 * @param {!Matrix4} b right matrix
 * @return {!Matrix4} the resulting matrix
 */
export function matrix4Product(a: Matrix4, b: Matrix4): Matrix4 {
    let result = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let num = 0;
            for (let k = 0; k < 4; k++) {
                num += a.getElement(i, k) * b.getElement(k, j);
            }
            result.push(num);
        }
    }

    return new Matrix4(result);
}

/**
 * Returns the sum of two Vector3's.
 * 
 * @param {!Vector3} v1
 * @param {!Vector3} v2 
 * @returns {!Vector3} the vector sum
 */
export function vector3Sum(v1: Vector3, v2: Vector3): Vector3 {
    const result = v1.clone();
    result.addVector(v2);
    return result;
}

/**
 * Returns dot product of two Vector3's.
 * 
 * @param v1 the left vector
 * @param v2 the right vector
 * @returns {!number} the dot product
 */
export function vector3DotProduct(v1: Vector3, v2: Vector3): number {
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
}

/**
 * Multiplies scalar and vector and returns the resulting vector.
 * 
 * @param {!number} s the scalar
 * @param {!Vector3} v the vector
 * @returns {!Vector3} the vector
 */
export function multiplyScalarAndVector3(s: number, v: Vector3): Vector3 {
    return new Vector3(s * v.x, s*v.y, s*v.z);
}

/**
 * Returns product of input matrix and vector. Converts input vector3 to Vector4 with w = 1 for calculation.
 * 
 * @param m the Matrix4
 * @param v the Vector3
 * @returns {!Vector3} the resulting vector.
 */
export function multiplyMatrix4AndVector3(m: Matrix4, v: Vector3): Vector3 {
    let components = [];
    for (let i = 0; i < 3; i++) {
        components.push(m.getElement(i, 0) * v.x + m.getElement(i, 1) * v.y + m.getElement(i, 2) * v.z + m.getElement(i, 3));
    }
    return new Vector3(components[0], components[1], components[2]);
}

/**
 * Returns a translation Matrix4 based on input.
 * 
 * @param {!number} tx amount of translation in x direction.
 * @param {!number} ty amount of translation in y direction.
 * @param {!number} tz amount of translation in z direction.
 * @return {!Matrix4} the Matrix4
 */
export function translationMatrix4(tx: number, ty: number, tz: number): Matrix4 {
    return new Matrix4([
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    ]);
}

/**
 * Returns an x-rotation matrix based on input. (ccw direction)
 * 
 * @param {!number} angle angle in radians
 * @return {!Matrix4} the matrix
 */
export function xRotationMatrix4(angle: number): Matrix4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Matrix4([
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1
    ]);
};

/**
 * Returns a y-rotation matrix based on input. (ccw direction)
 * 
 * @param {!number} angle angle in radians
 * @return {!Matrix4} the matrix
 */
 export function yRotationMatrix4(angle: number): Matrix4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Matrix4([
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
    ]);
};

/**
 * Returns a z-rotation matrix based on input. (ccw direction)
 * 
 * @param {!number} angle angle in radians
 * @return {!Matrix4} the matrix
 */
 export function zRotationMatrix4(angle: number): Matrix4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Matrix4([
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
};

/**
 * Returns a scaling matrix
 * @param {!number} sx amount to scale x by
 * @param {!number} sy amount to scale y by
 * @param {!number} sz amount to scale z by
 * @return {!Matrix4} the matrix
 */
export function scalingMatrix4(sx: number, sy: number, sz: number): Matrix4 {
    return new Matrix4([
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
    ]);
}

/**
 * Returns a orthographic projection Matrix4 that converts from world space to clip space.
 * The Matrix4 maps the space bounded by the clipping planes into the space of a cube with points in [-1 to +1] in x, y, and z directions.
 * (params all in world space coordinates)
 * 
 * @param {!number} left left side of clipping plane
 * @param {!number} right right side of clipping plane
 * @param {!number} top top side of clipping plane
 * @param {!number} bottom bottom side of clipping plane
 * @param {!number} near near side of clipping plane
 * @param {!number} far far side of clipping plane
 */
export function orthographicProjectionMatrix4(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
    // note: this matrix flips the y-axis so that 0 is at the top.
    return new Matrix4([
        2/(right - left), 0, 0, -(right + left)/(right - left),
        0, 2/(top - bottom), 0, -(top + bottom)/(top - bottom),
        0, 0, -2/(far - near), -(far + near)/(far - near),
        0, 0, 0, 1
    ]);
}