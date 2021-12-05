import {primitives} from "./scenes/primitives";
import {solar} from "./scenes/solar";
import {balls} from "./scenes/balls";
import {shadersScene} from "./scenes/shaders";
import {tunel} from "./scenes/tunel";

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const scene = urlParams.get('scene')

if (!scene) {
	window.location.replace(window.location.origin  + window.location.pathname + '?scene=tunel');
}

switch (scene) {
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