import * as consts from "client/classes/types/constants";


export function get_key (object, value) { return Object.keys (object).find (key => object [key] === value) }
export function notify () { alert (isset (arguments) ? Array.from (arguments).join ("\n") : "paused") }


/********/


export const pause = notify;


export function scroll_sizes (control) {
	return {
		width: control.scrollWidth,
		height: control.scrollHeight
	};
}// scroll_sizes;


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


export function is_empty (value) {
	return (not_set (value, consts.blank) || (value.length == 0));
}// is_empty;


export function is_function (value) {
	return value instanceof Function;
}// is_function;


export function is_null (value) {
	return value == null;
}// is_null;


export function is_object (value) { return value instanceof Object }
export function is_string (value) { return typeof value == "string" }
export function is_number (value) { return !isNaN (parseInt (value))}


export function is_undefined (value) {
	return (value == undefined) && not_null (value);
}// is_undefined;


export function isset (value) {
	return (!null_or_undefined (value));
}// isset;


export function not_empty (value) {
	return !is_empty (value);
}// not_empty;


export function not_set (value, ...nullables) {
	return !isset (value, ...nullables);
}// not_set;


export function not_null (value) {
	return !is_null (value);
}// not_null;


export function not_undefined (value) {
	return !is_undefined (value);
}// not_undefined;


export function null_value (value) { return isset (value) ? value : null }


export function null_or_undefined (value) {
	return (is_null (value) || (value == undefined));
}// null_or_undefined;


export function matching_objects (first_object, second_object) {

	if (null_or_undefined (first_object) || null_or_undefined (second_object)) return false;
	if (is_object (first_object) && is_object (second_object)) return (JSON.stringify (first_object) == JSON.stringify (second_object));
	
	return (first_object == second_object);

}// matching_objects;


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


export function nested_value (object, ...methods) {
	if (is_null (object)) return null;
	if (not_empty (methods)) return nested_value (object [methods [0]], ...(methods.slice (1)));
	return object;
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

