precision mediump float;
  
void main() {
    gl_FragColor = vec4(gl_FragCoord.zyx / 500.0, 1.0);
} 