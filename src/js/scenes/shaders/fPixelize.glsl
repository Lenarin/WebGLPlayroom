precision mediump float;

#define NUMBER_OF_TEXTURES 3
#define SPEED 1.0
#define FREQUENCY 10.25
#define AMPLITUDE 0.1

uniform float u_time;
uniform sampler2D u_textures[NUMBER_OF_TEXTURES];
uniform float u_canvas_size;

void main() {
    vec2 texture_coord = gl_FragCoord.xy / u_canvas_size;

    float block_size = abs(sin(u_time)) / 20.0;
    vec2 block_position = floor(texture_coord / block_size) * block_size;

    gl_FragColor = (
        texture2D(u_textures[0], block_position)
        + texture2D(u_textures[0], block_position + vec2(1.0, 0.0) * block_size)
        + texture2D(u_textures[0], block_position + vec2(0.0, 1.0) * block_size)
        + texture2D(u_textures[0], block_position + vec2(1.0, 1.0) * block_size)
    ) / 4.0;

}