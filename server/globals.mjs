global.blank = "";
global.space = " ";


/********/


global.is_null = value => { return value == null }
global.isset = value => { return value ? true : false }
global.is_empty = value => { return not_set (value) || (Array.isArray (value) && (value.length == 0))}
global.is_boolean = value => { return typeof value == "boolean" }
global.is_number = value => { return (!isNaN (Number (value)) && not_boolean (value)) }
global.integer_value = value => { return global.isset (value) ? parseInt (value) : null }

global.not_null = value => { return !global.is_null (value) }
global.not_empty = value => { return !is_empty (value) }
global.not_boolean = value => { return !is_boolean (value) }
global.not_number = value => { return !is_number (value) }

global.null_if = (value, comparison) => { return (value == comparison) ? null : value }


global.not_set = value => { 

	if (Array.notArray (value)) value = [value];
	if (!isset (value.find (item => !isset (item)))) return true;

	return false;

}/* not_set */;


/********/


const directions = {
	left: "left",
	right: "right",
	up: "up",
	down: "down"
}// directions;


/********/


Array.notArray = (candidate) => !Array.isArray (candidate);


Number.prototype.padded = function (length) { return `${"0".repeat (length - this.toString ().length)}${this.toString ()}` }


String.prototype.equals = function (comparison, case_sensitive = false) {
	if (is_null (comparison)) return false;
	return ((case_sensitive ? this : this.toLowerCase ()).trim () == (case_sensitive ? comparison : comparison.toLowerCase ()).trim ());
}// equals;


