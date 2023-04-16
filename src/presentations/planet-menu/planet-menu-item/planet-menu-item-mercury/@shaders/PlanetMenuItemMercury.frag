#version 300 es
precision mediump float;

const float UINT_MAX = float(0xFFFFFFFFu);
const vec4 DX = vec4(1., 0., 0., 0.);
const vec4 DY = vec4(0., 1., 0., 0.);
const vec4 DZ = vec4(0., 0., 1., 0.);
const vec4 DW = vec4(0., 0., 0., 1.);

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
  return float(hash(floatBitsToUint(x))) / UINT_MAX;
}
vec2 hash(vec2 x) {
  return vec2(hash(floatBitsToUint(x))) / UINT_MAX;
}
vec3 hash(vec3 x) {
  return vec3(hash(floatBitsToUint(x))) / UINT_MAX;
}

float lerp(float a, float b, float t) {
  return mix(a, b, t * t * t * (10. - 15. * t + 6. * t * t));
}
vec2 lerp(vec2 a, vec2 b, float t) {
  return mix(a, b, t * t * t * (10. - 15. * t + 6. * t * t));
}
vec3 lerp(vec3 a, vec3 b, float t) {
  return mix(a, b, t * t * t * (10. - 15. * t + 6. * t * t));
}
float lerp(float x00, float x10, float x01, float x11, vec2 t) {
  return lerp(lerp(x00, x10, t.x), lerp(x01, x11, t.x), t.y);
}
vec2 lerp(vec2 x00, vec2 x10, vec2 x01, vec2 x11, vec2 t) {
  return lerp(lerp(x00, x10, t.x), lerp(x01, x11, t.x), t.y);
}
vec3 lerp(vec3 x00, vec3 x10, vec3 x01, vec3 x11, vec2 t) {
  return lerp(lerp(x00, x10, t.x), lerp(x01, x11, t.x), t.y);
}
float lerp(float x000, float x100, float x010, float x110, float x001, float x101, float x011, float x111, vec3 t) {
  return lerp(lerp(lerp(x000, x100, t.x), lerp(x010, x110, t.x), t.y), lerp(lerp(x001, x101, t.x), lerp(x011, x111, t.x), t.y), t.z);
}
vec2 lerp(vec2 x000, vec2 x100, vec2 x010, vec2 x110, vec2 x001, vec2 x101, vec2 x011, vec2 x111, vec3 t) {
  return lerp(lerp(lerp(x000, x100, t.x), lerp(x010, x110, t.x), t.y), lerp(lerp(x001, x101, t.x), lerp(x011, x111, t.x), t.y), t.z);
}
vec3 lerp(vec3 x000, vec3 x100, vec3 x010, vec3 x110, vec3 x001, vec3 x101, vec3 x011, vec3 x111, vec3 t) {
  return lerp(lerp(lerp(x000, x100, t.x), lerp(x010, x110, t.x), t.y), lerp(lerp(x001, x101, t.x), lerp(x011, x111, t.x), t.y), t.z);
}

float vnoise(float x) {
  float i = floor(x);
  float f = fract(x);
  return lerp(hash(i), hash(i + DX.x), f);
}
vec2 vnoise(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  return lerp(hash(i), hash(i + DX.xy), hash(i + DY.xy), hash(i + DX.xy + DY.xy), f);
}
vec3 vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  return lerp(hash(i), hash(i + DX.xyz), hash(i + DY.xyz), hash(i + DX.xyz + DY.xyz), hash(i + DZ.xyz), hash(i + DX.xyz + DZ.xyz), hash(i + DY.xyz + DZ.xyz), hash(i + DX.xyz + DY.xyz + DZ.xyz), f);
}

uniform float u_time;

in vec3 v_position;
in vec3 v_coord;
in vec3 v_normal;
out vec4 outColor;

const int FBM_OCTAVES = 5;

vec3 fbm(vec3 x, float H) {
  float G = exp2(-H);
  float f = 1.0;
  float a = 1.0;
  vec3 t = vec3(0.0);
  for(int i = 0; i < FBM_OCTAVES; ++i) {
    t += a * vnoise(f * x);
    f *= 2.01;
    a *= G;
  }
  return t;
}

void main() {
  const vec3 light = normalize(vec3(-1.0, -1.0, -1.0));
  const vec3 color = vec3(0.2, 0.4, 0.6);
  vec3 eye = normalize(-v_coord);
  vec3 normal = normalize(v_normal + 0.5 * (fbm(6.0 * v_position + 1e-4 * u_time, 0.5) - 0.5));
  float diffuse = max(0.0, dot(reflect(light, normal), eye));
  float reflection = 1.0 - max(0.0, dot(reflect(light, normal), eye));
  outColor.rgb = mix(color, vec3(1.0), reflection);
  outColor.a = clamp(diffuse + reflection, 0.0, 1.0);
}
