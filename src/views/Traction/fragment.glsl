uniform vec3 uNearColor;
uniform vec3 uFarColor;

varying float vColor;

void main() {
  float distance = length(gl_PointCoord - vec2(0.5));
  float alpha = 1.0 - smoothstep(0.1, 0.5, distance);

  vec3 color = mix(uNearColor, uFarColor, vColor); 
  gl_FragColor = vec4(color, alpha);
}