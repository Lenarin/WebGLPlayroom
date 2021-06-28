precision mediump float;
uniform sampler2D u_texture;
uniform float u_canvas_size;

void main() {
    vec4 tex = texture2D(u_texture, gl_FragCoord.xy / u_canvas_size);
    float r = tex.r * 0.393 + tex.g * 0.769 + tex.b * 0.189;
    float g = tex.r * 0.349 + tex.g * 0.686 + tex.b * 0.168;
    float b = tex.r * 0.272 + tex.g * 0.534 + tex.b * 0.131;
    gl_FragColor = vec4(r, g, b, tex.a);
}