precision highp float;

uniform sampler2D texture;
uniform vec3 tint;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec4 color = texture2D(texture, uv);
  color.rgb *= tint;

  gl_FragColor = color;
}
