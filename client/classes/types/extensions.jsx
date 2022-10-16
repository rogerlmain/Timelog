import { isset, is_function } from "client/classes/common";
import { blank } from "client/classes/types/constants";


function process_mutation (target) {

	let node_type = target.getAttribute ("type") ?? target.type ?? blank;

	if (is_function (target.onLoad)) target.onLoad ();
	if (node_type.equals ("expando")) target.addEventListener ("keyup", event => event.target.size = Math.max (event.target.size, event.target.value.length, 1));

	// ... Put other mutation listeners here
	
	if (target.children.length > 0) Array.from (target.children).forEach (child => process_mutation (child));
	
}// process_mutation;


window.observer = new MutationObserver (mutations => mutations.forEach (mutation => process_mutation (mutation.target)));
window.observer.observe (document, { subtree: true, childList: true });

