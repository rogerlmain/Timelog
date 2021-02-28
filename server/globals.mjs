import Cookies from "./cookies.mjs";


/********/


global.blank = "";


/********/


global.get_cookie = (name) => {
	return new Cookies ().get_cookie (name);
}// get_cookie;


global.is_null = (value) => {
	return value == null;
}// is_null;


global.not_null = (value) => {
	return value != null;
}// not_null;


global.isset = (value) => {
	return value ? true : false;
//	return value != null;
}// not_null;


global.signed_in = () => {
	return global.not_null (new Cookies ().get_cookie ("account"));
}// signed_in;


global.signed_out = () => {
	return !global.signed_in ();
}// signed_out;


/********/

