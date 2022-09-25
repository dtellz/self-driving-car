/**
 * Linear interpolation check for reference https://en.wikipedia.org/wiki/Linear_interpolation widely used in the gaming industry
 */
function lerp(A, B, t) {
    return A + (B - A) * t;
}