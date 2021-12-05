import {primitives} from "./scenes/primitives";
import {solar} from "./scenes/solar";
import Navigo from "navigo";
import {balls} from "./scenes/balls";
import {shadersScene} from "./scenes/shaders";
import {tunel} from "./scenes/tunel";

const router = new Navigo('/');

router.on('/:type', function (match) {
	switch (match.url) {
		case 'solar':
			solar();
			break;

		case 'balls':
			balls();
			break;

		case 'primitives':
			primitives();
			break;

		case 'shaders':
			shadersScene();
			break;

		case 'tunel':
			tunel();
			break;
	}
});

router.resolve()

