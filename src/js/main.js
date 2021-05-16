import {primitives} from "./scenes/primitives";
import {solar} from "./scenes/solar";

const path = window.location.pathname;

switch (path.slice(1)) {
	case 'solar':
		solar();
		break;

	case 'primitives':
	default:
		primitives();
		break;
}

