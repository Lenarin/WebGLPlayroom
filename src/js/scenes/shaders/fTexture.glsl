precision mediump float;
uniform sampler2D u_texture;
uniform float u_canvas_size;

void main() {
    gl_FragColor = texture2D(u_texture, gl_FragCoord.xy / u_canvas_size);
} 