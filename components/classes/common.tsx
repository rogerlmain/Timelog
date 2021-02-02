import * as consts from "components/types/constants";


export function is_empty (value: any) {
	return !this.isset (value, consts.blank);
}// is_empty;


export function isset (value: any, ...nullables: any) {
	return not_null (value) && !nullables.includes (value);
}// isset;


export function is_null (value: any) {
	return value == null;
}// is_null;


export function not_empty (value: string) {
	return !is_empty (value);
}// not_empty;


export function not_null (value: any) {
	return !is_null (value);
}// not_null;


/********/


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

