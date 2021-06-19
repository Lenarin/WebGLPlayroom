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

    float time = u_time * SPEED;

    float x = (sin(texture_coord.y * FREQUENCY)
            +  sin(texture_coord.y * FREQUENCY * 2.1 + time)
            +  sin(texture_coord.y * FREQUENCY * 1.1 + time * 0.41)
            +  sin(texture_coord.y * FREQUENCY * 1.2 + time * 0.21))
            *  AMPLITUDE;

    if (texture_coord.x - 0.5 > x) {
        gl_FragColor = texture2D(u_textures[0], texture_coord);
    } else {
        gl_FragColor = texture2D(u_textures[1], texture_coord);
    }

}