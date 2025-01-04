attribute float scale;
attribute vec3 color;

uniform float maxSize;

varying vec3 vColor;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = scale / -mvPosition.z;
  
  vColor = mix(vec3(1.0), color, scale / maxSize);
}