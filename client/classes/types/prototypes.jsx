import * as constants from "classes/types/constants";
import * as common from "classes/common";


/**** Array Helper Functions ****/


Array.has_value = function (candidate) { return Array.isArray (candidate) && (candidate.length > 0) }


Array.range = function (start, end) {
	let result = new Array ();
	for (let index = start; index <= end; index++) result.push (index);
	return result;
}// Array.range;


/**** Array Prototype Functions ****/


Array.prototype.get_index = function (item) {
	let index = this.indexOf (item);
	return (index < 0) ? 0 : index;
}// get_index;


Array.prototype.insert = function (item, index) {
    this.splice (index, 0, item);
}// insert;


Array.prototype.prepend = function (item) {
	this.insert (item, 0);
}// prepend;


Array.prototype.remove = function (element) {
	let index = this.indexOf (element);
	if (index < 0) return;
	this.splice (index, 1);
}// remove;


Array.prototype.extract = function (value, name = "id") {
	for (let item of this) {
		if (common.is_object (item) && (item [name] == value)) return item;
	}// for;
	return null;
}// extract;


/**** Date Helper Functions ****/


Date.minute_coef = 60;
Date.hour_coef = Date.minute_coef * 60;
Date.day_coef = Date.hour_coef * 24;

Date.is_date = (candidate) => { return (candidate instanceof Date) }
Date.not_date = (candidate) => { return !this.is_date (candidate) }


// Date.elapsed: returns a time period in minutes in the format: dd:hh:mm (may need to adjust for other formats)
Date.elapsed = function (elapsed_time /* in minutes */) {

	let days = Math.floor (elapsed_time / Date.day_coef);
	let hours = Math.floor ((elapsed_time - (days * Date.day_coef)) / Date.hour_coef);
	let mins = Math.floor ((elapsed_time - ((days * Date.day_coef) + (hours * Date.hour_coef))) / Date.minute_coef);

	return `${((days > 0) ? `${days}:` : constants.empty)}${((days > 0) ? hours.padded (2) : hours)}:${mins.padded (2)}`;

}// elapsed;


Date.fromGMT = function (date_string) { return new Date (new Date (date_string).toLocaleString ()).format (constants.date_formats.database_timestamp) }

Date.month_name = (month) => { return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month] }


Date.validated = (date) => {
	if (common.is_string (date)) date = new Date (date);
	return (Date.is_date (date)) ? date : null;
}// validated;


/**** Date Prototype Functions ****/


Date.parts = {
	year		: "year",
	month		: "month",
	day			: "day",
	hour		: "hour",
	minute		: "minute",
	second		: "second",
	millisecond	: "millisecond"
}/* parts */;


Date.increments 			= {}
Date.increments.millisecond = 1;
Date.increments.second		= Date.increments.millisecond * 1000,
Date.increments.minute		= Date.increments.second * 60,
Date.increments.hour		= Date.increments.minute * 60,
Date.increments.day			= Date.increments.hour * 24,


Date.prototype.get_date = function () { return new Date (this.format (constants.date_formats.database_date)) }
Date.prototype.get_month = function () { return this.getMonth () }
Date.prototype.get_year = function () { return this.getFullYear () }


Date.prototype.before = function (comparison) { return this - comparison < 0 }
Date.prototype.after = function (comparison) { return this - comparison > 0 }


Date.prototype.add = function (amount, part) { 

	if ([Date.parts.year, Date.parts.month].includes (part)) {
		if ((part == Date.parts.year) || ((part == Date.parts.month) && (this.getMonth () == 11))) this.setFullYear (this.getFullYear () + 1);
		if (part == Date.parts.month) this.setMonth (this.getMonth + 1);
		return;
	}// if;

	this.setTime (this.getTime () + (Date.increments [part] * amount));
	return this; // for chaining

}// add;


Date.prototype.round_hours = function (direction) {

	let result = new Date (this);

	if (direction == constants.date_rounding.up) result.setHours ((result.getMinutes () == 0) ? result.getHours () : result.getHours () + 1); 

	result.setMinutes (0);
	result.setSeconds (0);
	result.setMilliseconds (0);

	return result;

}// round_hours;


Date.prototype.round_minutes = function (count, direction) {

	let result = new Date (this);
	let minutes = Math.floor (result.getMinutes () / count) * count;

	// If not specified then round off
	if (common.not_set (direction)) direction = ((result.getMinutes () % count) < (count / 2)) ? constants.date_rounding.down : constants.date_rounding.up;

	result.setMinutes (direction == constants.date_rounding.down ? minutes : minutes + count);
	result.setSeconds (0);
	result.setMilliseconds (0);

	return result;

}// round_minutes;


Date.prototype.same_day = function (input_date) {

	let new_date = Date.validated (input_date);

	if (common.is_null (new_date)) return false;
	
	if (this.getDate () != new_date.getDate ()) return false;
	if (this.getMonth () != new_date.getMonth ()) return false;
	if (this.getFullYear () != new_date.getFullYear ()) return false;

	return true;

}// same_day;


Date.prototype.same_month = function (date_one, date_two) {

	date_one = Date.validated (date_one);
	date_two = Date.validated (date_two);

	if (date_one.getMonth () != date_two.getMonth ()) return false;
	if (date_one.getFullYear () != date_two.getFullYear ()) return false;

	return true;

}// same_month;


Date.prototype.same_year = function (date_one, date_two) {

	date_one = Date.validated (date_one);
	date_two = Date.validated (date_two);

	if (date_one.getFullYear () != date_two.getFullYear ()) return false;

	return true;

}// same_year;


Date.prototype.format = function (selected_format) {

	const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	let hours = this.getHours ();
	let month = this.getMonth ();

	let result = (selected_format.replace ? selected_format : constants.blank);

	result = result.replace ("MMMM", "!!").replace ("w", "@@");

	return result.
		replace ("yyyy", this.getFullYear ().toString ()).
		replace ("MM", (month + 1).toString ().padStart (2, "0")).
		replace ("dd", this.getDate ().toString ().padStart (2, "0")).
		replace ("HH", hours.toString ().padStart (2, "0")).
		replace ("mm", this.getMinutes ().padded (2)).
		replace ("M", (month + 1).toString ()).
		replace ("d", this.getDate ().toString ()).
		replace ("H", ((hours > 12) ? hours - 12 : hours).toString ()).
		replace ("ap", (hours < 12) ? "am" : "pm").

		replace ("!!", Date.month_name (month)).
		replace ("@@", weekdays [this.getDay ()]);

}// format;


/***** DOMRect ****/


DOMRect.prototype.contains = function (point) {
	if (common.not_set (point)) return false;
	if (common.isset (point.x) && ((point.x < this.left) || (point.x > this.right))) return false;
	if (common.isset (point.y) && ((point.y < this.top) || (point.y > this.bottom))) return false;
	return true;
}// contains;


/**** FormData ****/


FormData.fromObject = function (object) { 
	let result = new FormData ();
	result.appendAll (object);
	return result;
}// fromObject;


/****/


FormData.prototype.appendAll = function (object) { Object.keys (object).forEach (key => this.append (key, object [key])) }
FormData.prototype.toObject = function () { return Object.fromEntries (this) }
FormData.prototype.toJson = function () { return JSON.stringify (this.toObject ()) }


/**** HTMLElement ****/


HTMLElement.prototype.absolutePosition = function () {
	var rect = this.getBoundingClientRect ();
	return {
		left: Math.round (rect.left + document.body.scrollLeft),
		top: Math.round (rect.top + document.body.scrollTop)
	}
}// absolutePosition;


HTMLElement.prototype.addClass = function (new_class) {
	let classes = this.className.split (constants.space).filter (item => common.not_empty (item));
	if (classes.indexOf (new_class) >= 0) return;
	classes.push (new_class);
	this.className = classes.join (constants.space);
}// addClass;


HTMLElement.prototype.attributeLength = function (attribute) {
	return (this.hasAttribute (attribute) ? this.getAttribute (attribute).toString ().length : null);
}// attributeLength;


HTMLElement.prototype.removeClass = function (new_class) {
	let classes = this.className.split (constants.space);
	if (classes.indexOf (new_class) >= 0) classes.remove (new_class);
	this.className = classes.join (constants.space);
}// removeClass;


// Calculates the amount of space in the parent container
HTMLElement.prototype.availableWidth = function () {
	return (this.offsetWidth == 0) ? this.parentElement.availableWidth () : this.offsetWidth;
}// availableWidth;


// Calculates the amount of space in the parent container
HTMLElement.prototype.availableHeight = function () {
	return (this.offsetHeight == 0) ? this.parentElement.availableHeight () : 
	this.offsetHeight;
}// availableHeight;


HTMLElement.prototype.freeze = function () {
	let dimensions = { width: this.offsetWidth, height: this.offsetHeight }
	if (dimensions.width != null) this.style.width = `${dimensions.width}px`;
	if (dimensions.height != null) this.style.height = `${dimensions.height}px`;
	return dimensions;
}// freeze;


HTMLElement.prototype.getNumber = function (attribute) {
	let value = parseInt (this.getAttribute (attribute));
	return isNaN (value) ? null : value;
}// getNumber;


HTMLElement.prototype.property = function (property_name) {
	return getComputedStyle (this).getPropertyValue (property_name);
}// property;


HTMLElement.prototype.setAttributes = function (attributes) { for (let key in attributes) this.setAttribute (key, attributes [key]) }
HTMLElement.prototype.removeAttributes = function (/* keys */) { for (let attribute of arguments) this.removeAttribute (attribute) }


HTMLElement.prototype.isComplete = function () {

	let input_mask = this.getAttribute ("input_mask");

	if (common.isset (input_mask)) {

		let entry_length = this.value.extractNumber ().length;
		let required_length = input_mask.extractNumber ().length;
		let common_length = 0;

		for (let index = 0; index < Math.min (this.value.length, input_mask.length); index++) {
			if (common.is_number (this.value [index]) && (this.value [index] == input_mask [index])) common_length++;
		}// for;

		return (entry_length == common_length) || (entry_length == required_length);

	}// if;

	return true;

}// isComplete;


HTMLElement.prototype.notComplete = function () { return !this.isComplete () }


HTMLElement.prototype.addValidator = function (validator) {
	let parent_validator = this.validate;
	this.validate = function (event) {
		if (!parent_validator.bind (this) (event)) return false;
		if (!validator.bind (this) (event)) return false;
		return true;
	}// validate;
}// addValidator;


// Returns optional boolean = valid, for chaining.
HTMLElement.prototype.setValidity = function (valid, message = null) {
	if (valid) {
		this.setCustomValidity (constants.blank);
		this.removeClass ("invalid");
		return true;
	}// if;	
	this.setCustomValidity (message);
	this.addClass ("invalid");
	return false;
}// setValidity;


HTMLElement.prototype.validate = function () {

	const provided = () => {

		if (!this.hasAttribute ("required")) return true;

		switch (this.hasAttribute ("pattern")) {
			case true: if (!this.getAttribute ("input_mask").replaceAll ("9","*").equals (this.value)) return true; break;
			default: if (this.value.not_empty ()) return true; break;
		}// switch;

		return false;

	}/* provided */;


	const pattern_match = () => {
		if (!this.hasAttribute ("pattern")) return true;
		if (this.isComplete ()) return true;
		return false;
	}/* pattern_match */;


	let labels = common.not_empty (this.id) ? document.querySelectorAll (`[for=${this.id}]`) : null;
	let field_name = (common.isset (labels) && (labels.length > 0)) ? labels [0].innerText : "This field";

	this.setValidity (provided (), `${field_name} is a required value.`);
	this.setValidity (pattern_match (), "Please match the pattern provided.");
	
	return true;
	
}// validate;


HTMLElement.prototype.visible = function () {
	if (this.style.display.equals ("none")) return false;
	if (this.style.visibility.equals ("hidden")) return false;
	if (parseInt (this.style.opacity) == 0) return false;
	return true;
}// if;


/********/


HTMLSelectElement.prototype.selectedText = function () {
	return this.options [this.selectedIndex].text;
}// selectedText;


HTMLSelectElement.prototype.selectedValue = function () {
	return (this.children [this.selectedIndex]).value;
}// selectedValue;


/********/


Number.prototype.padded = function (length) {
	return this.toString ().padded (length, "0", constants.directions.left);
}// if;


/********/


String.prototype.char_count = function (character) { return (this.match (new RegExp (character, "g")) ?? []).length }


String.prototype.extractNumber = function () {
	let result = constants.blank;
	for (var i = 0; i < this.length; i++) {
		if (common.is_number (this [i])) result += this [i];
	}// for;
	return result;
}// extractNumber;


String.prototype.padded = function (length, character, direction = null) {
	let result = this;
	while (result.length < length) {
		switch (direction) {
			case constants.directions.left: result = character + result; break;
			default: result += character; break;
		}// switch;
	}// while;
	return result.toString ();
}// padded;


String.prototype.equals = function (comparison, case_sensitive = false) {
	if (common.is_null (comparison)) return false;
	return ((case_sensitive ? this : this.toLowerCase ()).trim () == (case_sensitive ? comparison : comparison.toLowerCase ()).trim ());
}// equals;


String.prototype.empty = function () { return this.trim () == constants.blank }
String.prototype.not_empty = function () { return !this.empty () }


String.prototype.matches = function (pattern) { return common.isset (this.match (pattern)) }


String.prototype.splice = function (start_index, end_index, replacement = null) {

	let start = common.is_number (start_index) ? parseInt (start_index) : null;
	let finish = common.is_number (end_index) ? parseInt (end_index) : null;

	if (common.is_null (start) || common.is_null (finish) || (finish > start)) return this;

	return `${this.substring (0, start)}${replacement}${this.substring (finish)}`;
	
}// splice;


String.prototype.titled = function () { return this.charAt (0).toUpperCase () + this.slice (1) }
