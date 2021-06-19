precision mediump float;

#define NUMBER_OF_POINTS 10
#define WHITE vec4(1.0)
#define BLACK vec4(vec3(0.0), 1.0)
#define EPSILON 0.003
#define NUMBER_OF_TEXTURES 3

uniform float u_time;
uniform sampler2D u_textures[NUMBER_OF_TEXTURES];
uniform float u_canvas_size;
uniform vec2 u_points[NUMBER_OF_POINTS];

void main() {
    vec2 texture_coord = gl_FragCoord.xy / u_canvas_size;

    float min_distance = 1.0;
    int area_index = 0;
    int number_of_near_points = 0;

    for (int i = 0; i < NUMBER_OF_POINTS; i++) {
        float current_distance = distance(texture_coord, u_points[i]);

        if (current_distance < min_distance) {
            min_distance = current_distance;
            area_index = i;
        }
    }

    int texture_index = int(mod(float(area_index), float(NUMBER_OF_TEXTURES)));

    if (texture_index == 0) {
        gl_FragColor = texture2D(u_textures[0], texture_coord);
    } else if (texture_index == 1) {
        gl_FragColor = texture2D(u_textures[1], texture_coord);
    } else if (texture_index == 2) {
        gl_FragColor = texture2D(u_textures[2], texture_coord);
    }

    for (int i = 0; i < NUMBER_OF_POINTS; i++) {
        if (distance(texture_coord, u_points[i]) < min_distance + EPSILON) {
            number_of_near_points++;
        }
    }

    if (number_of_near_points > 1) {
        gl_FragColor.rgb = vec3(1.0);
    }
}