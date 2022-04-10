import Cookies from "./cookies.mjs";


/********/


global.blank = "";
global.space = " ";


/********/


global.get_cookie = (name) => {
	return new Cookies ().get_cookie (name);
}// get_cookie;


/********/


global.is_null = value => { return value == null }
global.not_null = value => { return !global.is_null (value) }

global.isset = value => { return value ? true : false }
global.not_set = value => { return !global.isset (value) }

global.is_empty = value => { return not_set (value) || (Array.isArray (value) && (value.length == 0))}
global.not_empty = value => { return !is_empty (value) }

global.is_boolean = value => { return typeof value == "boolean" }
global.not_boolean = value => { return !is_boolean (value) }

global.integer_value = value => { return global.isset (value) ? parseInt (value) : null }

global.null_if = (value, comparison) => { return (value == comparison) ? null : value }

/********/


global.signed_in = () => {
	return global.not_null (new Cookies ().get_cookie ("current_account"));
}// signed_in;


global.signed_out = () => {
	return !global.signed_in ();
}// signed_out;


/********/

