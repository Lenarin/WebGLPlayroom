precision mediump float;
uniform float u_time;

void main() {
    gl_FragColor = vec4(
            abs(sin(u_time)),
            abs(sin(u_time * 3.0)),
            abs(sin(u_time * 5.0)), 1.0);
} 