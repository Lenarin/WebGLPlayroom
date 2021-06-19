precision mediump float;
uniform sampler2D u_texture;
uniform float u_canvas_size;
uniform float u_time;

void main() {
    gl_FragColor = texture2D(u_texture, gl_FragCoord.xy / u_canvas_size + sin(u_time + gl_FragCoord.y / 30.0) / 100.0);
} 