#version 300 es
precision lowp float;

const float UINT_MAX = float(uint(0xFFFFFFFFu));

uint hash(uint x) {
  uint h = x;
  h += (h << 10u);
  h ^= (h >> 6u);
  h += (h << 3u);
  h ^= (h >> 11u);
  h += (h << 15u);
  return h;
}
uvec2 hash2(uvec2 x) {
  uvec2 h = x;
  h += (h << 10u), h ^= (h >> 6u), h += (h << 3u), h ^= (h >> 11u), h += (h << 15u);
  return h;
}
uint hash(uvec2 x) {
  return hash(hash(x.x) ^ x.y);
}
uint hash(uvec3 x) {
  return hash(hash(hash(x.x) ^ x.y) ^ x.z);
}
uint hash(uvec4 x) {
  return hash(hash(hash(x.x) ^ x.y) ^ hash(hash(x.z) ^ x.w));
}

float noise(float x) {
  return float(hash(floatBitsToUint(x))) / UINT_MAX;
}
float noise(vec2 x) {
  return float(hash(floatBitsToUint(x))) / UINT_MAX;
}
float noise(vec3 x) {
  return float(hash(floatBitsToUint(x))) / UINT_MAX;
}
float noise(vec4 x) {
  return float(hash(floatBitsToUint(x))) / UINT_MAX;
}
vec2 noise2(float x) {
  return vec2(hash2(floatBitsToUint(x))) / UINT_MAX;
}
vec2 noise2(vec2 x) {
  return vec2(hash2(floatBitsToUint(x))) / UINT_MAX;
}
vec2 noise2(vec3 x) {
  return vec2(hash2(floatBitsToUint(x))) / UINT_MAX;
}
vec2 noise2(vec4 x) {
  return vec2(hash2(floatBitsToUint(x))) / UINT_MAX;
}

out vec4 outColor;

void main() {
  outColor.rgb = noise2(gl_FragCoord.xy).xyx;
  outColor.a = 1.0;
}
