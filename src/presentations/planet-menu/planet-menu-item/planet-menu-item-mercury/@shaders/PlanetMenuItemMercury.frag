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

float noise(float x) {
  const float dx = 1.0;
  float i = floor(x);
  float f = fract(x);
  return mix(hash(i), hash(i + dx), f);
}

vec2 noise(vec2 x) {
  const vec2 dx = vec2(1.0, 0.0);
  const vec2 dy = vec2(0.0, 1.0);
  vec2 i = floor(x);
  vec2 f = fract(x);
  return mix(mix(hash(i), hash(i + dx), f.x), mix(hash(i + dy), hash(i + dy + dx), f.x), f.y);
}

vec3 noise(vec3 x) {
  const vec3 dx = vec3(1.0, 0.0, 0.0);
  const vec3 dy = vec3(0.0, 1.0, 0.0);
  const vec3 dz = vec3(0.0, 0.0, 1.0);
  vec3 i = floor(x);
  vec3 f = fract(x);
  return mix(mix(mix(hash(i), hash(i + dx), f.x), mix(hash(i + dy), hash(i + dy + dx), f.x), f.y), mix(mix(hash(i + dz), hash(i + dz + dx), f.x), mix(hash(i + dz + dy), hash(i + dz + dy + dx), f.x), f.y), f.z);
}

uniform float u_time;

in vec3 coord;
out vec4 outColor;

const int FBM_OCTAVES = 5;

float fbm(vec3 x, float H) {
  float G = exp2(-H);
  float f = 1.0;
  float a = 1.0;
  float t = 0.0;
  for(int i = 0; i < FBM_OCTAVES; ++i) {
    t += a * noise(f * x).x;
    f *= 2.01;
    a *= G;
  }
  return t;
}

void main() {
  const vec3 color = vec3(0.2, 0.3, 1.0);
  outColor.rgb = clamp(color * 0.5 * fbm(coord.xyz, 0.5), 0.0, 1.0);
  outColor.a = 1.0;
}
