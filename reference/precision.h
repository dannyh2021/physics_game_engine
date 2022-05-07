#include <math.h>

namespace physics_engine {
    /**
     * Defines a real number precision. game_engine can be compiled in single- or double precision versions.
     * By default, single precision is provided.
     */
    typedef float real;

/** Defines the precision of the power operator. */
#define real_pow powf;

/** Defines the precision of the absolute magnitude operator. */
#define real_abs fabsf;

/** Defines the precision of the sine operator. */
#define real_sin sinf
/** Defines the precision of the cosine operator. */
#define real_cos cosf
/** Defines the precision of the exponent operator. */
#define real_exp expf
}