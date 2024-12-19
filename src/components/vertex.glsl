attribute float alpha;
attribute float scale;
attribute float angle;

uniform float uScaleFactor;

varying float vAlpha;
varying vec2 vAngle;

void main() {
  vAlpha = alpha;
  vAngle = vec2(cos(angle), sin(angle));

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (scale * uScaleFactor) / -mvPosition.z;
}