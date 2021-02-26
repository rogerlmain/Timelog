import * as consts from "components/types/constants";

import { SizeRecord } from "components/types/datatypes";


export function scroll_sizes (control: HTMLElement): SizeRecord {
	return {
		width: control.scrollWidth,
		height: control.scrollHeight
	};
}// scroll_sizes;


export function computed_sizes (control: HTMLElement): SizeRecord {
	let computed_styles = window.getComputedStyle (control);
	return {
		width: Math.ceil (parseFloat (computed_styles.width)),
		height: Math.ceil (parseFloat (computed_styles.height))
	};
}// computed_sizes;


export function styled_sizes (control: HTMLElement): SizeRecord {
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


export function not_empty (value: any) {
	return !is_empty (value);
}// not_empty;


export function isset (value: any, ...nullables: any) {
	return not_null (value) && !nullables.includes (value);
}// isset;


export function not_set (value: any, ...nullables: any) {
	return !isset (value, ...nullables);
}// not_set;


export function is_null (value: any) {
	return value == null;
}// is_null;


export function not_null (value: any) {
	return !is_null (value);
}// not_null;


/********/


export function exists (object: any, ...methods: any) {
	if (is_null (object)) return false;
	if (not_empty (methods)) return exists (object [methods [0]], ...(methods.slice (1)));
	return true;
}// exists;


export function nested_value (object: any, ...methods: any) {
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


export function delete_cookie (name: any) {
	document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}// delete_cookie;

export function clear_cookie (name: any) { this.delete_cookie (name); }


/********/


export let is_blank = is_empty;
export let not_blank = not_empty;

