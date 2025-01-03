varying vec3 vColor;

void main() {
  float distance = length(gl_PointCoord - vec2(0.5));
  float alpha = 1.0 - smoothstep(0.49, 0.5, distance);

  if (alpha < 0.5) {
    discard;
  }

  gl_FragColor = vec4(vColor, alpha);
}