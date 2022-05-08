// 3D Vector with support operations
// invariant: vector must have non-negative magnitude (|v| >= 0)
export default class Vector3 {
    constructor(public x: number, public y: number, public z: number) {}

    // returns the magnitude of this vector
    magnitude(): number {
        return Math.sqrt(this.squaredMagnitude());
    }

    // returns the squared magnitude of this vector
    squaredMagnitude(): number {
        return this.x*this.x + this.y*this.y + this.z*this.z;
    }

    // normalizes this vector (assumes length is nonnegative)
    normalize(): void {
        const length = this.magnitude();
        this.x /= length;
        this.y /= length;
        this.z /= length;
    }

    // inverts this vector
    invert(): void {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    // adds another Vector3 to this vector
    addVector(v: Vector3): void {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    // add a Vector3 scaled by s to this vector
    addScaledVector(s: number, v: Vector3): void {
        this.x += s * v.x;
        this.y += s * v.y;
        this.z += s * v.z;
    }

    // set components of this vector
    setComponents(x: number, y: number, z: number): void {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // multiply this vector by a scalar
    multiplyScalar(s: number): void {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }

    // returns a cloned copy of the vector
    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    // below are static methods

    // returns scalar product of a scalar and a vector
    static scalarProduct(s: number, v: Vector3): Vector3 {
        return new Vector3(s * v.x, s * v.y, s * v.z);
    }

    // returns the cross product of two vectors
    static crossProduct(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(
            v1.y*v2.z - v2.y*v1.z,
            v1.x*v2.z - v2.x*v1.z,
            v1.x*v2.y - v2.x*v1.x
        );
    }
}