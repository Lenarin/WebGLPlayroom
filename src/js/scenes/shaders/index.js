import vDefault from './vDefault.glsl';
import fGold from './fGold.glsl';
import fGradient from './fGradient.glsl';
import fAnim from './fAnim.glsl';
import fTexture from './fTexture.glsl';
import fAnim1 from './fAnim1.glsl';
import fAnim2 from './fAnim2.glsl';
import fMozaic from './fMozaic.glsl';
import fSplit from './fSplit.glsl';
import fPixelize from './fPixelize.glsl';
import fGrayscale from './fGrayscale.glsl';
import fSepia from './fSepia.glsl';

export const shaders = {
    gold: {
        vertex: vDefault,
        fragment: fGold
    },
    gradient: {
        vertex: vDefault,
        fragment: fGradient
    },
    anim: {
        vertex: vDefault,
        fragment: fAnim
    },
    texture: {
        vertex: vDefault,
        fragment: fTexture
    },
    anim1: {
        vertex: vDefault,
        fragment: fAnim1
    },
    anim2: {
        vertex: vDefault,
        fragment: fAnim2
    },
    mozaic: (() => {
        const points = [];
        const numberOfPoints = 10;

        const movePoints = (timeStamp) => {
            if (!timeStamp) return;

            for (let i = 0; i < numberOfPoints; i++) {
                points[i][0] += Math.sin(i * timeStamp / 5000.0) / 500.0;
                points[i][1] += Math.cos(i * timeStamp / 5000.0) / 500.0;
            }

            for (let i = 0; i < numberOfPoints; i++) {
                for (let j = i; j < numberOfPoints; j++) {
                    let deltaX = points[i][0] - points[j][0];
                    let deltaY = points[i][1] - points[j][1];
                    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                    if (distance < 0.1) {
                        points[i][0] += 0.001 * Math.sign(deltaX);
                        points[i][1] += 0.001 * Math.sign(deltaY);
                        points[j][0] -= 0.001 * Math.sign(deltaX);
                        points[j][1] -= 0.001 * Math.sign(deltaY);
                    }
                }
            }
        }

        const init = (GL, PROGRAM) => {
            for (let i = 0; i < numberOfPoints; i++) {
                points.push([Math.random(), Math.random()]);
            }

        }

        const update = (GL, PROGRAM, timeStamp) => {
            movePoints(timeStamp);
            for (let i = 0; i < numberOfPoints; i++) {
                GL.uniform2fv(GL.getUniformLocation(PROGRAM, 'u_points[' + i + ']'), points[i]);
            }
        }

        return {
            vertex: vDefault,
            fragment: fMozaic,
            init,
            update
        }
    })(),
    split: {
        vertex: vDefault,
        fragment: fSplit,
    },
    pixelize: {
        vertex: vDefault,
        fragment: fPixelize,
    },
    grayscale: {
        vertex: vDefault,
        fragment: fGrayscale
    },
    sepia: {
        vertex: vDefault,
        fragment: fSepia
    }
}
