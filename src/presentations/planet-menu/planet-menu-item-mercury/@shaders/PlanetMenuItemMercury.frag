#version 300 es
precision mediump float;

const float MAX_UHASH_FLOAT = float(0xFFFFFFFFu);

uint hash(uint x) {
  uint h = x;
  h += (h << 10u);
  h ^= (h >> 6u);
  h += (h << 3u);
  h ^= (h >> 11u);
  h += (h << 15u);
  return h;
}

uvec2 hash(uvec2 x) {
  uvec2 h = x;
  h += (h << 10u);
  h ^= (h >> 6u);
  h += x.yx;
  h += (h << 10u);
  h ^= (h >> 6u);
  h += (h << 3u);
  h ^= (h >> 11u);
  h += (h << 15u);
  return h;
}

uvec3 hash(uvec3 x) {
  uvec3 h = x;
  h += (h << 10u);
  h ^= (h >> 6u);
  h += x.yzx;
  h += (h << 10u);
  h ^= (h >> 6u);
  h += x.zxy;
  h += (h << 10u);
  h ^= (h >> 6u);
  h += (h << 3u);
  h ^= (h >> 11u);
  h += (h << 15u);
  return h;
}

float hash(float x) {
  return float(hash(floatBitsToUint(x))) / MAX_UHASH_FLOAT;
}

vec2 hash(vec2 x) {
  return vec2(hash(floatBitsToUint(x))) / MAX_UHASH_FLOAT;
}

vec3 hash(vec3 x) {
  return vec3(hash(floatBitsToUint(x))) / MAX_UHASH_FLOAT;
}

uniform float u_time;

in vec3 coord;
out vec4 outColor;

void main() {
  outColor.rgb = vec3(hash(coord.xyz + 1.).xyz);
  outColor.a = 1.0;
}
