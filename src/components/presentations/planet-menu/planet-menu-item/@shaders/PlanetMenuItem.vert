#version 300 es
precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

in vec3 position;
in vec3 normal;
out vec3 v_position;
out vec3 v_coord;
out vec3 v_normal;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  v_position = position;
  v_coord = mvPosition.xyz;
  v_normal = normalMatrix * normal;
}
