import * as consts from "client/classes/types/constants";


export function boolean_value (value) { return (is_string (value) && (value.equals ("true") || value.equals ("on"))) }
export function integer_value (value) { return isset (value) ? parseInt (value) : null }

export function get_key (object, value) { return get_keys (object).find (key => object [key] === value) }
export function get_keys (object) { return is_object (object) ? Object.keys (object) : null }
export function get_values (object) { return is_object (object) ? Object.values (object) : null }

export function notify () { alert (not_empty (arguments) ? Array.from (arguments).join ("\n") : "paused") }


/********/


export const pause = notify;


export function coalesce (...values) {
	for (let i = 0; i < values.length; i++) {
		if (not_empty (values [i])) return values [i];
	}// for;
	return null;
}// coalesce;


export function computed_sizes (control) {
	let computed_styles = window.getComputedStyle (control);
	return {
		width: Math.ceil (parseFloat (computed_styles.width)),
		height: Math.ceil (parseFloat (computed_styles.height))
	};
}// computed_sizes;


export function scroll_sizes (control) {
	return {
		width: control.scrollWidth,
		height: control.scrollHeight
	};
}// scroll_sizes;


export function styled_sizes (control) {
	let result = {
		width: parseInt (control.style.width),
		height: parseInt (control.style.height),
	}// result;
	if (isNaN (result.width)) result.width = 0;
	if (isNaN (result.height)) result.height = 0;
	return result;
}// styled_sizes;


export function html_encode (value) {
	return value.replace ("<", "&lt;").replace (">", "&gt;");
}// html_encode;


export function json_string (value) {
	return JSON.stringify (value).replace (",", ",\n");
}// json_string;


/**** Type Test Routines ****/


export function is_array (value) { return Array.isArray (value) }
export function is_date (value) { return value instanceof Date }
export function is_empty (value) { return (not_set (value, consts.blank) || (value.length == 0)) }
export function is_function (value) { return value instanceof Function }
export function is_null (value) { return value == null }
export function is_number (value) { return !isNaN (Number (value)) }
export function is_object (value) { return ((value instanceof Object) && not_array (value)) }
export function is_primitive (value) { return (value !== Object (value)) }
export function isset (value) { return (!null_or_undefined (value)) }
export function is_string (value) { return typeof value == "string" }
export function is_undefined (value) { return (value == undefined) && not_null (value) }

export function not_array (value) { return !is_array (value) }
export function not_empty (value) { return !is_empty (value) }
export function not_set (value, ...nullables) { return !isset (value, ...nullables) }
export function not_null (value) { return !is_null (value) }
export function not_undefined (value) { return !is_undefined (value) }

export function null_value (value) { return isset (value) ? value : null }
export function null_or_undefined (value) { return (is_null (value) || (value == undefined)) }


export function matching_objects (first_object, second_object) {
	if (not_set (first_object)) return not_set (second_object);
	return (JSON.stringify (first_object).equals (JSON.stringify (second_object)));
}// matching_objects;


export function clone (object) { 

	let result = null;

	if (is_primitive (object)) return object;

	if (is_date (object)) return new Date (object.getTime ());

	if (is_object (object)) {

		get_keys (object).forEach (key => {

			if (is_null (object [key])) return;
			if (is_null (result)) result = {}

			result [key] = clone (object [key]);

		});

		return isset (result) ? result : object;

	}// if;

	if (Array.isArray (object)) {
		object.forEach (item => {
			if (is_null (result)) result = [];
			result.push (clone (item));
		});
		return result;
	}// if;

	return object;

}// clone;


export function zero_value (value) { return null_or_undefined (value) ? 0 : value }


/********/


export function dimensions (object) {
	let result = null;
	if (isset (object)) {
		let current_style = {
			visibility: object.style.visibility,
			display: object.style.display
		}// current_style;
		object.style.visibility = "hidden";
		object.style.display = null;
		result = {
			width: object.offsetWidth,
			height: object.offsetHeight
		}// result;
		object.style.display = current_style.display;
		object.style.visibility = current_style.visibility;
		return result;
	}// if;
}// dimensions;


export function exists (object, ...methods) {
	if (is_null (object)) return false;
	if (not_empty (methods)) return exists (object [methods [0]], ...(methods.slice (1)));
	return true;
}// exists;


export function nested_value () {

	if (is_null (arguments [0])) return null;

	if (arguments.length < 2) throw "nested_value requires at least two parameters";
	if (!is_object (arguments [0])) throw "first parameter in nested_value must be an object";

	let next_object = arguments [0] [arguments [1]];
	let remaining_parameters = Array.from (arguments).slice (2);

	let funky = is_function (next_object);

	if (is_empty (remaining_parameters)) return funky ? next_object.bind (arguments [0]) () : next_object;

	return nested_value (funky? next_object.bind (arguments [0]) () : next_object, ...remaining_parameters);

}// nested_value;


export function refresh (control, callback = null) {
	if (isset (control.props) && isset (control.props.children)) {
		let children = Array.isArray (control.props.children) ? control.props.children : [control.props.children];
		children.map ((element) => refresh (element));
	}// if;
	if (isset (control.ref) && isset (control.ref.current)) refresh (control.ref.current);
	if (isset (control.setState)) control.setState (null, callback);
}// refresh;


/********/


export function next_integer () { 
	for (let candidate of arguments) {
		let candidate_integer = parseInt (candidate);
		if (isNaN (candidate_integer)) continue;
		return candidate_integer;
	}// for;
	return null;
}// next_integer;




export let is_blank = is_empty;
export let not_blank = not_empty;

