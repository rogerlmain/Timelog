global.blank = "";
global.space = " ";


/********/


global.is_null = value => (value == null);
global.isset = value => (value ? true : false);
global.is_empty = value => (not_set (value) || (Array.isArray (value) && (value.length == 0)));
global.is_boolean = value => (typeof value == "boolean");
global.is_number = value => (!isNaN (Number (value)) && not_boolean (value));

global.is_object = value => ((value instanceof Object) && (!Array.isArray (value)));

global.integer_value = value => isset (value) ? parseInt (value) : null;

global.not_null = value => !is_null (value);
global.not_set = value => !isset (value);
global.not_empty = value => !is_empty (value);
global.not_boolean = value => !is_boolean (value);
global.not_number = value => !is_number (value);

global.null_if = (value, comparison) => { return (value == comparison) ? null : value }


/********/


const directions = {
	left: "left",
	right: "right",
	up: "up",
	down: "down"
}// directions;


/********/


Number.prototype.padded = function (length) { return `${"0".repeat (length - this.toString ().length)}${this.toString ()}` }


String.prototype.equals = function (comparison, case_sensitive = false) {
	if (is_null (comparison)) return false;
	return ((case_sensitive ? this : this.toLowerCase ()).trim () == (case_sensitive ? comparison : comparison.toLowerCase ()).trim ());
}// equals;


