import React from "react";

import { blank } from "client/classes/types/constants";
import { unlimited } from "client/classes/types/options";


/********/


export const detab = text => text.replace (/\n[\t]*/g, "\n");

export const debugging = (active = true) => (active && window.location.hostname.equals ("localhost"));
export const live = (live = true) => !debugging (live);


export function boolean_value (value) { return (is_string (value) && (value.equals ("true") || value.equals ("on"))) }
export function dom_element (element) { return React.isValidElement (element) && is_string (element.type)}
export function multiline_text () { return Array.from (arguments).join ("\n") }
export function integer_value (value) { return isset (value) ? parseInt (value) : null }

export function notify () { alert (not_empty (arguments) ? multiline_text (...arguments) : "paused") }

export function randomized (number) { return ((parseInt (number) * 1000) + (Math.random () * 1000)) }

export function is_unlimited (value) { return (value == unlimited) }


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


export function jsonify (value) {

	const visited = new WeakSet ();

	const filter = (key, value) => {
		if (is_object (value, true)) {
			if (visited.has (value)) return;
			visited.add (value);
		}// if;
		return value;
	}/* filter */;

	let result = JSON.stringify (value, filter);
	return result;

}// jsonify;


/**** Type Test Routines ****/


export function is_array (value) { return Array.isArray (value) }
export function is_boolean (value) { return typeof value == "boolean" }
export function is_date (value) { return value instanceof Date }
export function is_empty (value) { return (is_string (value) ? value.empty () : not_set (value, blank) || (value.length == 0)) }
export function is_function (value) { return value instanceof Function }
export function is_null (value) { return value == null }
export function is_number (value) { return isset (value) && !isNaN (Number (value)) }
export function is_object (value, include_arrays = false) { return ((value instanceof Object) && (include_arrays || not_array (value))) }
export function is_primitive (value) { return (value !== Object (value)) }
export function is_promise (value) { return (value instanceof Promise) }
export function isset (value) { return (!null_or_undefined (value)) }
export function is_string (value) { return typeof value == "string" }
export function is_undefined (value) { return (value == undefined) && not_null (value) }

export function not_array (value) { return !is_array (value) }
export function not_empty (value) { return !is_empty (value) }
export function not_function (value) { return !is_function (value) }
export function not_set (value, ...nullables) { return (!isset (value)) || Array.from (nullables).includes (value) }
export function not_null (value) { return !is_null (value) }
export function not_number (value) { return !is_number (value) }
export function not_object (value, include_arrays = false) { return !is_object (value, include_arrays) }
export function not_string (value) { return !is_string (value) }
export function not_undefined (value) { return !is_undefined (value) }

export function nulled (value) { return (null_or_undefined (value)) ? null : value }
export function null_value (value) { return ((value === 0) || (value === blank) || not_set (value)) ? null : value }
export function null_or_undefined (value) { return (is_null (value) || (value == undefined)) }


export function compare (first_object, second_object) {
	if (not_set (first_object)) return not_set (second_object);
	return (jsonify (first_object).equals (jsonify (second_object)));
}// compare;


export function numeric_value (value) { 
	value = integer_value (value);
	return isNaN (value) ? 0 : value;
}// numeric_value;


/********/


export function decode_string (input_string) {

	let result = null;

	if (not_string (input_string) || is_empty (input_string)) return result;

	while (input_string.length > 0) {

		let next_index = parseInt (input_string.substring (0, 2));
		let next_item = input_string.substr (2, next_index);

		input_string = input_string.substring (next_item.toString ().length + 2);

		if (is_null (result)) result = [];
		result.push (next_item);

	}// while;

	return result;

}// decode_string;


/********/


export function actual_size (object) {

	let result = null;

	if (isset (object)) {
		let current_style = {
			visibility: object.style.visibility,
			display: object.style.display
		}// current_style;
		object.style.visibility = "hidden";
		object.style.display = null;
		result = control_size (object);
		object.style.display = current_style.display;
		object.style.visibility = current_style.visibility;
		return result;
	}// if;

}// actual_size;


export function same_size (first_size, second_size) {
	if (not_object (first_size) || not_object (second_size)) return false;
	if (first_size.width != second_size.width) return false;
	if (first_size.height != second_size.height) return false;
	return true;
}// same_size;


export const different_sizes = (first_size, second_size) => !same_size (first_size, second_size);


/********/


export function exists (object, ...methods) {
	if (is_null (object)) return false;
	if (not_empty (methods)) return exists (object [methods [0]], ...(methods.slice (1)));
	return true;
}// exists;


// DEPRECATED - USE BUILD-IN ?.
export function nested_value () {

	if (debugging (false)) console.log ("nested_value is deprecated. Use built-in ?. instead.");

	if (is_null (arguments [0])) return null;

	if (arguments.length < 2) throw "nested_value requires at least two parameters";
	if (not_object (arguments [0], true)) throw "first parameter in nested_value must be an object";

	let next_object = arguments [0][arguments [1]];
	let remaining_parameters = Array.from (arguments).slice (2);

	if (is_function (next_object)) return arguments [0][arguments [1]] (...remaining_parameters);
	if (is_empty (remaining_parameters)) return next_object;

	return nested_value (next_object, ...remaining_parameters);

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



/**** Operating Theatre ****/



export function raw_style (control) {

	let result = null;

	Object.keys (control?.style).forEach (key => {

		let value = control.style [key];

		if (not_set (value, blank)) return;
		if (is_null (result)) result = {};

		result [key] = control.style [key];

	});

	return result;

}// raw_style;



























