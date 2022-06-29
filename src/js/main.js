import {primitives} from "./scenes/primitives";
import {solar} from "./scenes/solar";
import {balls} from "./scenes/balls";
import {shadersScene} from "./scenes/shaders";
import {tunel} from "./scenes/tunel";

if (window.location.pathname === "/") {
	window.location.replace(window.location.origin + '/tunel');
}

switch (window.location.pathname) {
	case '/solar':
		solar();
		break;

	case '/balls':
		balls();
		break;

	case '/primitives':
		primitives();
		break;

	case '/shaders':
		shadersScene();
		break;

	case '/tunel':
		tunel();
		break;
}