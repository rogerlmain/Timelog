import * as consts from "types/constants";

import { Dimensions } from "types/datatypes";


export function scroll_sizes (control: HTMLElement): Dimensions {
	return {
		width: control.scrollWidth,
		height: control.scrollHeight
	};
}// scroll_sizes;


export function coalesce (...values: any) {
	for (let i = 0; i < values.length; i++) {
		if (not_empty (values [i])) return values [i];
	}// for;
	return null;
}// coalesce;


export function computed_sizes (control: HTMLElement): Dimensions {
	let computed_styles = window.getComputedStyle (control);
	return {
		width: Math.ceil (parseFloat (computed_styles.width)),
		height: Math.ceil (parseFloat (computed_styles.height))
	};
}// computed_sizes;


export function styled_sizes (control: HTMLElement): Dimensions {
	let result = {
		width: parseInt (control.style.width),
		height: parseInt (control.style.height),
	}// result;
	if (isNaN (result.width)) result.width = 0;
	if (isNaN (result.height)) result.height = 0;
	return result;
}// styled_sizes;


export function html_encode (value: string) {
	return value.replace ("<", "&lt;").replace (">", "&gt;");
}// html_encode;


export function is_empty (value: any) {
	return (not_set (value, consts.blank) || (Array.isArray (value) && (value.length == 0)));
}// is_empty;


export function is_function (value: any) {
	return value instanceof Function;
}// is_function;


export function is_object (value: any) {
	return value instanceof Object;
}// is_object;


export function is_null (value: any) {
	return value == null;
}// is_null;


export function is_undefined (value: any) {
	return (is_null (value) || (value == undefined));
}// is_undefined;


export function isset (value: any, ...nullables: any) {
	return not_null (value) && !nullables.includes (value);
}// isset;


export function not_empty (value: any) {
	return !is_empty (value);
}// not_empty;


export function not_set (value: any, ...nullables: any) {
	return !isset (value, ...nullables);
}// not_set;


export function not_null (value: any) {
	return !is_null (value);
}// not_null;


export function null_value (value: any, replacement: any, ...nullables: any): any {
	let result: any = isset (value, ...nullables) ? value : replacement;
	return result;
}// null_value;


export function same_object (first_object: any, second_object: any) {

	if (is_undefined (first_object) || is_undefined (second_object)) return false;

	if (is_object (first_object) && is_object (second_object)) {		
		for (let key in first_object.keys) {
			switch (is_object (first_object [key])) {
				case true: if (!same_object (first_object [key], second_object [key])) return false;
				default: if (first_object [key] != second_object [key]) return false;
			}// switch;
		}// for;
		return true;
	} // if;
	
	return (first_object == second_object);

}// same_object;


/********/


export function exists (object: any, ...methods: any): boolean {
	if (is_null (object)) return false;
	if (not_empty (methods)) return exists (object [methods [0]], ...(methods.slice (1)));
	return true;
}// exists;


export function nested_value (object: any, ...methods: any): any {
	if (is_null (object)) return null;
	if (not_empty (methods)) return nested_value (object [methods [0]], ...(methods.slice (1)));
	return object;
}// nested_value;


export function dimensions (object: HTMLElement) {
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


export function refresh (control: any, callback: any = null) {
	if (isset (control.props) && isset (control.props.children)) {
		let children = Array.isArray (control.props.children) ? control.props.children : [control.props.children];
		children.map ((element: any) => refresh (element));
	}// if;
	if (isset (control.ref) && isset (control.ref.current)) refresh (control.ref.current);
	if (isset (control.setState)) control.setState (null, callback);
}// refresh;


/********/


export function get_cookie (name: any) {
	const cookies = document.cookie.split (";");
	for (var cookie of cookies) {
		var parts = cookie.split ("=");
		if (parts.length != 2) return null;
		if (parts [0].trim () != name) continue;
		return parts [1];
	}// for;
}// get_cookie;


export function set_cookie (name: string, value: any) {
	document.cookie = `${name}=${value}`;
}// set_cookie;


export function set_state (control: any, values: any = null, callback: any = null) {
	if ((control.current && control.current.setState) || (control.ref && control.ref.current && control.ref.current.setState)) return control.current.setState (values, callback);
	setTimeout (() => { set_state (control, values, callback) });
}// set_state;


export function delete_cookie (name: any) {
	document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}// delete_cookie;

export function clear_cookie (name: any) { delete_cookie (name); }


/********/


export let is_blank = is_empty;
export let not_blank = not_empty;

