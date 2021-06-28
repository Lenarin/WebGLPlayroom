precision mediump float;
uniform sampler2D u_texture;
uniform float u_canvas_size;

void main() {
    vec4 tex = texture2D(u_texture, gl_FragCoord.xy / u_canvas_size);
    float lum = tex.r * 0.3 + tex.g * 0.59 + tex.b * 0.11;
    gl_FragColor = vec4(vec3(lum), 1.0);
}