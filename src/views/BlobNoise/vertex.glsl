attribute float scale;
attribute vec3 color;

varying vec3 vColor;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float scaleT = scale / -mvPosition.z;
  gl_PointSize = scaleT;
  
  vColor = mix(vec3(1.0), color, scaleT);
}