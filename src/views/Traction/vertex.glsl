attribute float color;
varying float vColor;

void main() {
  vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (1.0 - vColor) * 15.0 + 2.0;
}