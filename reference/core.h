#include "precision.h";

namespace physics_engine {
    /**
     * Holds a vector in three dimensions. Four data members are allocated to ensure alignment in an array.
     */
    class Vector3 {
        public:
            real x, y, z;
        private:
            /** Padding to ensure four word alignment. */
            real padding;
        public:
            /** The default constructor creates a zero vector. */
            Vector3() : x(0), y(0), z(0) {}

            /** The explicit constructor creates a vector with the given components. */
            Vector3(const real x, const real y, const real z) : x(x), y(y), z(z) {}

            /** Flips all the components of the vector. */
            void invert() {
                x = -x;
                y = -y;
                z = -z;
            }

            /** Gets the magnitude of this vector. */
            real magnitude() const {
                return real_sqrt(x*x + y*y + z*z);
            }

            /** Gets the squared magnitude of this vector. */
            real squaredMagnitude() const {
                return x*x + y*y + z*z;
            }

            /** Turns a non-zero vector into a vector of unit length. */
            void normalize() {
                real l = magnitude();
                if (l > 0) {
                    (*this) *= ((real)1)/l;
                }
            }

            /** Multiplies this vector by the given scalar. */
            void operator*=(const real value) {
                x *= value;
                y *= value;
                z *= value;
            }

            /** Returns a copy of this vector scaled by the given value. */
            Vector3 operator*(const real value) const {
                return Vector3(x*value, y*value, z*value);
            }

            /** Adds the given vector to this. */
            void operator+=(const Vector3& v) {
                x += v.x;
                y += v.y;
                z += v.z;
            }

            /** Returns the value of the given vector added to this. */
            Vector3 operator+(const Vector3& v) const {
                return Vector3(v+v.x, y+v.y, z+v.z);
            }

            /** Subtracts the given vectro from this. */
            void operator-=(const Vector3& v) {
                x -= v.x;
                y -= v.y;
                z -= v.z;
            }
    
            /** Returns the value of the given vector subtracted from this. */
            Vector3 operator-(const Vector3& v) const {
                return Vector3(v-v.x, y-v.x, z-v.z);
            }
    
            /** Adds the given vector, scaled by the given amount, to this. */
            void addScaledVector(const Vector3& vector, real scale) {
                x += vector.x * scale;
                y += vector.y * scale;
                z += vector.z * scale;
            }
    
            /** Calculates and returns a component-wise product of this vector with the given vector. */
            Vector3 componentProduct(const Vector3 &vector) const {
                return Vector3(x * vector.x, y * vector.y, z * vector.z);
            }

            /** Performs a component-wise product with the given vector and sets this vector to its result. */
            void componentProductUpdate(const Vector3 &vector) {
                x *= vector.x;
                y *= vector.y;
                z *= vector.z;
            }

            /** Calculates and returns the dot product of this vector with the given vector. */
            real dotProduct(const Vector3 &vector) const {
                return x*vector.x + y*vector.y + z*vector.z;
            }

            /** Calculates and returns the dot product of this vector with the given vector. */
            real operator *(const Vector3 &vector) const {
                return dotProduct(vector);
            }

            /** Calculates and returns the cross product of this vector with the given vector. */
            Vector3 crossProduct(const Vector3 &vector) const {
                return Vector3(y*vector.z - z*vector.y,
                               z*vector.x - x*vector.z,
                               x*vector.y - y*vector.x);
            }

            /** Updates this vector to be the cross product of its current value and the given vector. */
            void operator %=(const Vector3 &vector) {
                *this = crossProduct(vector);
            }

            /** Calculates and returns the cross product of this vector with the given vector. */
            Vector3 operator%(const Vector3 &vector) {
                return crossProduct(vector);
            }
    };
}