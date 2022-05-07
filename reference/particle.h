#include "core.h";

using namespace physics_engine;

/**
 * A particle is the simplest object that can be simulated in the physics system.
 */

class Particle {
    protected:
        /** Holds the linear position of the particle in world space. */
        Vector3 position;

        /** Holds the linear velocity of the particle in world space. */
        Vector3 velocity;

        /** Holds the acceleration of the particle. */
        Vector3 acceleration;

        /** Holds the amount of damping applied to linear motion.
         *  Damping is required to remove energy added through numerical instability in the integrator.
        */
        real damping;

        /**
         * Holds the inverse of the mass of the particle.
         * It is more useful to hold the inverse mass because integration is simpler, and because in real time similutaion it is more useful to have objects with inifinite mass (immovable) than zero mass (unstable in numerical simulation). */
        real inverseMass;

        /**
         * Integrates the particle forwards in time by the given amount.
         * This function uses a Newton-Euler integration method, which is a linear approximation to the correct integral.
         * Thus, it may be inaccurate is some cases. */
        void integrate(real duration);

        /** Holds the accumulated force to be applied at the next simulation iteration only.
         * This value is zeroed at each integration step. */
        Vector3 forceAccum;

        /** Clears the forces applied to the particle.
         * This will be called automatically after each integration step. */
        void clearAccumulator();

        /** Adds the given force to the particle to be applied at the next iteration only. */
        void addForce(const Vector3 &force);
};