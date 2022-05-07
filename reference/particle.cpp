#include <assert.h>;
#include "particle.h";

using namespace physics_engine;

void Particle::integrate(real duration) {
    // We don't integrate things with infinite mass.
    if (inverseMass <= 0.0f) return;

    assert(duration > 0.0);

    // Update linear position.
    position.addScaledVector(velocity, duration);

    // Work out the acceleration from the force and update linear velocity.
    Vector3 resultingAcc = acceleration;
    velocity.addScaledVector(resultingAcc, duration);

    // Impose drag.
    velocity *= real_pow(damping, duration);

    // Clear the forces.
    clearAccumulator();
}

void Particle::clearAccumulator() {
    forceAccum.clear();
}

void Particle::addForce(const Vector3 &force);