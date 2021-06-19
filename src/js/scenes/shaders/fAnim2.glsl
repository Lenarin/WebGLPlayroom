precision mediump float;
uniform sampler2D u_texture;
uniform float u_canvas_size;
uniform float u_time;

float rand(vec2 seed) {
    return fract(sin(dot(seed, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 position) {
    vec2 block_position = floor(position);

    float top_left_value     = rand(block_position);
    float top_right_value    = rand(block_position + vec2(1.0, 0.0));
    float bottom_left_value  = rand(block_position + vec2(0.0, 1.0));
    float bottom_right_value = rand(block_position + vec2(1.0, 1.0));

    vec2 computed_value = fract(position);

    return mix(top_left_value, top_right_value, computed_value.x)
    + (bottom_left_value  - top_left_value)  * computed_value.y * (1.0 - computed_value.x)
    + (bottom_right_value - top_right_value) * computed_value.x * computed_value.y
    - 0.5;
}

void main() {
    vec2 texture_coord = gl_FragCoord.xy / u_canvas_size;
    gl_FragColor = texture2D(u_texture, 
        texture_coord 
        + vec2(
            noise(texture_coord * 10.0 + sin(u_time + texture_coord.x * 5.0)) / 10.0,
            noise(texture_coord * 10.0 + cos(u_time + texture_coord.y * 5.0)) / 10.0));
} 