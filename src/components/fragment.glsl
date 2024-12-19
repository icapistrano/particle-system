uniform sampler2D uTexture;
uniform vec3 uStartColor;
uniform vec3 uEndColor;

varying float vAlpha;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  vec4 texture = texture2D(uTexture, coords);

  vec3 color = mix(uEndColor, uStartColor, vAlpha);
  gl_FragColor = vec4(texture.rgb * color, texture.a * vAlpha);
}