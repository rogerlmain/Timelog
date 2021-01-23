const cookies = require("./cookies");


/********/


global.blank = "";


/********/


global.get_cookie = (name) => {
	return cookies.get_cookie (name);
}// get_cookie;


global.is_null = (value) => {
	return value == null;
}// is_null;


global.not_null = (value) => {
	return value != null;
}// not_null;


global.isset = (value) => {
	return value != null;
}// not_null;


global.signed_in = () => {
	return global.not_null (cookies.get_cookie ("account"));
}// signed_in;


global.signed_out = () => {
	return !global.signed_in ();
}// signed_out;


/********/

