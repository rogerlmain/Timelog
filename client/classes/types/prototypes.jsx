import { blank, space, date_formats, date_rounding, directions, empty } from "classes/types/constants";
import { isset, is_object, is_string, is_null, is_number, not_empty, not_set, null_value, get_keys, null_or_undefined, is_array } from "classes/common";


const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


/**** Array Helper Functions ****/


Array.arrayify = (candidate) => { return (Array.isArray (candidate) ? candidate : (is_null (candidate) ? null : [candidate])) }
Array.get_element = (array, index) => { return (Array.isArray (array) && (array.length >= index)) ? array [index] : null }
Array.has_value = function (candidate) { return Array.isArray (candidate) && (candidate.length > 0) }


Array.push = (array, ...datastuff) => { 
	if (null_or_undefined (array)) array = [];
	if (is_array (array)) array.push (...datastuff);
	return array;
}// push;


Array.range = (start, end) => {
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


Array.prototype.merge = function (new_values) {
	if (!Array.isArray (new_values)) new_values = [new_values];
	new_values.forEach (value => this.push (value));
	return this;
}// merge;


Array.prototype.nest_item = function (value, ...path) {

	let next_array = this;

	while (path.length > 0) {
		if (not_set (next_array [path [0]])) next_array [`"${path [0]}"`] = [];
		next_array = next_array [`"${path [0]}"`];
		path = path.slice (1);
	}// while;
	
	next_array.push (value);
	return this; // for chaining;
	
}// Array.nested_array;


Array.prototype.prepend = function (item) { this.insert (item, 0) }


Array.prototype.remove = function (element) {
	let index = this.indexOf (element);
	if (index >= 0) this.splice (index, 1);
	return this;
}// remove;


Array.prototype.replace = function (element, replacement) {
	this.splice (this.indexOf (element), 1, replacement);
	return this;
}// replace;


Array.prototype.extract = function (value, name = "id") {
	for (let item of this) {
		if (is_object (item) && (item [name] == value)) return item;
	}// for;
	return null;
}// extract;


/**** Date Helper Functions ****/

Date.coefficient = {}

Date.coefficient.minute = 60;
Date.coefficient.quarter = Date.coefficient.minute * 15;
Date.coefficient.hour = Date.coefficient.quarter * 4;
Date.coefficient.day = Date.coefficient.hour * 24;


Date.is_date = (candidate) => { return (candidate instanceof Date) }
Date.not_date = (candidate) => { return !this.is_date (candidate) }


// Date.elapsed: returns a time period in minutes in the format: dd:hh:mm (may need to adjust for other formats)
Date.elapsed = function (elapsed_time /* in minutes */) {

	let days = Math.floor (elapsed_time / Date.coefficient.day);
	let hours = Math.floor ((elapsed_time - (days * Date.coefficient.day)) / Date.coefficient.hour);
	let mins = Math.floor ((elapsed_time - ((days * Date.coefficient.day) + (hours * Date.coefficient.hour))) / Date.coefficient.minute);

	return `${((days > 0) ? `${days}:` : empty)}${((days > 0) ? hours.padded (2) : hours)}:${mins.padded (2)}`;

}// elapsed;


Date.fromGMT = function (date_string) { return new Date (new Date (date_string).toLocaleString ()).format (date_formats.database_timestamp) }

Date.month_name = (month) => { return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month] }
Date.weekday_name = (day) => { return weekdays [day] }


Date.validated = (date) => {
	if (is_string (date)) date = new Date (date);
	return (Date.is_date (date)) ? date : null;
}// validated;


/**** Date Prototype Functions ****/

Date.meridians = {
	am: "am",
	pm: "pm"
}// meridians;


Date.parts = {
	years			: "years",
	months			: "months",
	days			: "days",
	hours			: "hours",
	minutes			: "minutes",
	seconds			: "seconds",
	milliseconds	: "milliseconds",
	meridians		: "meridian",
}/* parts */;


Date.increments 				= {}
Date.increments.milliseconds 	= 1;
Date.increments.seconds			= Date.increments.milliseconds * 1000,
Date.increments.minutes			= Date.increments.seconds * 60,
Date.increments.hours			= Date.increments.minutes * 60,
Date.increments.days			= Date.increments.hours * 24,


Date.prototype.get_date = function () { return new Date (this.format (date_formats.database_date)) } // removes time component

Date.prototype.get_day = function () { return this.getDate () }

Date.prototype.get_weekday = function () { return this.getDay () }
Date.prototype.get_weekday_name = function () { return Date.weekday_name (this.get_weekday ())};

Date.prototype.get_month = function () { return this.getMonth () }
Date.prototype.get_year = function () { return this.getFullYear () }


Date.prototype.get_hours = function (twenty_four = false) { return twenty_four ? this.getHours () : ((this.getHours () % 12) || 12) }
Date.prototype.get_meridian = function () { return (this.getHours () > 12) ? Date.meridians.pm : Date.meridians.am }

Date.prototype.morning = function () { return this.get_meridian () == Date.meridians.am }
Date.prototype.afternoon = Date.prototype.evening = function () { return this.get_meridian () == Date.meridians.pm }

Date.prototype.before = function (comparison) { return this - comparison < 0 }
Date.prototype.after = function (comparison) { return this - comparison > 0 }

Date.prototype.get_month_name = function () { return Date.month_name (this.get_month ()) }


Date.prototype.get_appended_day = function () {

	let day = this.get_day ();

	switch (day) {
		case 1: return `${day}st`;
		case 2: return `${day}nd`;
		case 3: return `${day}rd`;
		default: return `${day}th`;
	}// switch;
	
}// get_appended_day;


Date.prototype.add = function (part, amount) { 
	this.setTime (this.getTime () + (Date.increments [part] * amount));
	return this;
}// add;


Date.prototype.round_hours = function (direction) {

	let result = new Date (this);

	if (direction == date_rounding.up) result.setHours ((result.getMinutes () == 0) ? result.getHours () : result.getHours () + 1); 

	result.setMinutes (0);
	result.setSeconds (0);
	result.setMilliseconds (0);

	return result;

}// round_hours;


Date.prototype.round_minutes = function (count, direction) {

	let result = new Date (this);
	let minutes = Math.floor (result.getMinutes () / count) * count;

	// If not specified then round off
	if (not_set (direction)) direction = ((result.getMinutes () % count) < (count / 2)) ? date_rounding.down : date_rounding.up;


//	result.setMinutes (direction == date_rounding.down ? minutes : minutes + count);

result.setMinutes ((direction == date_rounding.down) || ((direction == date_rounding.off) && ((result.getMinutes () - minutes) < (count / 2))) ? minutes : minutes + count);


	result.setSeconds (0);
	result.setMilliseconds (0);

	return result;

}// round_minutes;


Date.prototype.same_day = function (input_date) {

	let new_date = Date.validated (input_date);

	if (is_null (new_date)) return false;
	
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

	let hours = this.getHours ();
	let month = this.getMonth ();

	let result = (selected_format.replace ? selected_format : blank);

	result = result.replace ("MMMM", "!!").replace ("w", "@@");

	return result.
		replace ("yyyy", this.getFullYear ().toString ()).
		replace ("MM", (month + 1).toString ().padStart (2, "0")).
		replace ("dd", this.getDate ().toString ().padStart (2, "0")).
		replace ("HH", hours.toString ().padStart (2, "0")).
		replace ("mm", this.getMinutes ().padded (2)).
		replace ("ss", this.getSeconds ().padded (2)).
		replace ("M", (month + 1).toString ()).
		replace ("d", this.getDate ().toString ()).
		replace ("H", (hours % 12) || 12).
		replace ("ap", (hours < 12) ? "am" : "pm").

		replace ("!!", Date.month_name (month)).
		replace ("@@", weekdays [this.getDay ()]);

}// format;


/***** DOMRect ****/


DOMRect.prototype.contains = function (point) {
	if (not_set (point)) return false;
	if (isset (point.x) && ((point.x < this.left) || (point.x > this.right))) return false;
	if (isset (point.y) && ((point.y < this.top) || (point.y > this.bottom))) return false;
	return true;
}// contains;


/**** FormData ****/


FormData.fromObject = function (object) { 
	let result = new FormData ();
	result.appendAll (object);
	return result;
}// fromObject;


/****/


FormData.prototype.appendAll = function (object) { 
	get_keys (object).forEach (key => this.append (key, object [key]));
	return this; // for chaining;
}// appendAll;


FormData.prototype.toJsonString = function () { return JSON.stringify (this.toObject ()) }
FormData.prototype.toObject = function () { return Object.fromEntries (this) }



/**** HTMLElement Prototype Methods ****/


HTMLElement.prototype.absolutePosition = function () {
	var rect = this.getBoundingClientRect ();
	return {
		left: Math.round (rect.left + document.body.scrollLeft),
		top: Math.round (rect.top + document.body.scrollTop)
	}
}// absolutePosition;


HTMLElement.prototype.addClass = function (new_class) {
	let classes = this.className.split (space).filter (item => not_empty (item));
	if (classes.indexOf (new_class) >= 0) return;
	classes.push (new_class);
	this.className = classes.join (space);
}// addClass;


HTMLElement.prototype.attributeLength = function (attribute) {
	return (this.hasAttribute (attribute) ? this.getAttribute (attribute).toString ().length : null);
}// attributeLength;


HTMLElement.prototype.pathed_id = function () {

	let result = null;
	let item = this;
	let index = 0;

	while (isset (item)) {
		
		let name = null_value (item.id) ?? item.tagName.toLowerCase ();

		if (is_null (name)) name = "ufo";

		result = (is_null (result)) ? name : `${name}_$_${result}`;
		item = item.parentElement;
		index++;

	}// while;

	return `${result}_$${index}`;

}/* pathed_id */;


HTMLElement.prototype.removeClass = function (new_class) {
	let classes = this.className.split (space);
	if (classes.indexOf (new_class) >= 0) classes.remove (new_class);
	this.className = classes.join (space);
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


HTMLElement.prototype.freezeWidth = function () { this.style.width = `${this.clientWidth}px` }
HTMLElement.prototype.freezeHeight = function () { this.style.height = `${this.clientHeight}px` }


HTMLElement.prototype.freeze = function () {
	this.freezeWidth ();
	this.freezeHeight ();
}// freeze;


HTMLElement.prototype.thawWidth = function () { this.style.width = null }
HTMLElement.prototype.thawHeight = function () { this.style.height = null }


HTMLElement.prototype.thaw = function () {
	this.thawWidth ();
	this.thawHeight ();
}// thaw;


HTMLElement.prototype.getNumber = function (attribute) {
	let value = parseInt (this.getAttribute (attribute));
	return isNaN (value) ? null : value;
}// getNumber;


HTMLElement.prototype.property = function (property_name) {
	return getComputedStyle (this).getPropertyValue (property_name);
}// property;


HTMLElement.prototype.setAttributes = function (attributes) { for (let key in attributes) this.setAttribute (key, attributes [key]) }
HTMLElement.prototype.removeAttributes = function (/* keys */) { for (let attribute of arguments) this.removeAttribute (attribute) }


HTMLElement.prototype.index = function () { return isset (this.parent) ? Array.from (this.parent.children).indexOf (this) : 0 }


HTMLElement.prototype.isComplete = function () {

	let input_mask = this.getAttribute ("input_mask");

	if (isset (input_mask)) {

		let entry_length = this.value.extractNumber ().length;
		let required_length = input_mask.extractNumber ().length;
		let common_length = 0;

		for (let index = 0; index < Math.min (this.value.length, input_mask.length); index++) {
			if (is_number (this.value [index]) && (this.value [index] == input_mask [index])) common_length++;
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
		this.setCustomValidity (blank);
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
			case true: if (this.value.indexOf ("*") < 0) return true; break;
			default: if (not_empty (this.value)) return true; break;
		}// switch;

		return false;

	}/* provided */;


	const pattern_match = () => {
		if (!this.hasAttribute ("pattern")) return true;
		if (this.value.matches (this.getAttribute ("pattern"))) return true;
		return false;
	}/* pattern_match */;


	let labels = not_empty (this.id) ? document.querySelectorAll (`[for=${this.id}]`) : null;
	let field_name = (isset (labels) && (labels.length > 0)) ? labels [0].innerText : "This field";

	if (!this.setValidity (provided (), `${field_name} is a required value.`)) return false;
	if (!this.setValidity (pattern_match (), "Please match the pattern provided.")) return false;
	
	return true;
	
}// validate;


HTMLElement.prototype.visible = function () {
	if (this.style.display.equals ("none")) return false;
	if (this.style.visibility.equals ("hidden")) return false;
	if (parseInt (this.style.opacity) == 0) return false;
	return true;
}// visible;


/**** HTMLFormElement ****/


HTMLFormElement.prototype.validate = function () {
	let result = true;
	let items = this.querySelectorAll ("input, select, textarea");
	for (let item of items) if (!item.validate ()) result = false;
	return result;
}// validate;


/**** HTMLSelectElement ****/


HTMLSelectElement.prototype.selectedText = function () {
	return this.options [this.selectedIndex].text;
}// selectedText;


HTMLSelectElement.prototype.selectedValue = function () {
	return (this.children [this.selectedIndex]).value;
}// selectedValue;


/**** Number Prototype Functions ****/


Number.prototype.padded = function (length) {
	return this.toString ().padded (length, "0", directions.left);
}// if;


Number.prototype.toCurrency = function () {
	let dollars = parseInt (this / 100).toLocaleString ("en-US");  // TODO : Modify to allow international customers
	let cents = this % 100;
	return `${dollars}.${cents}`;
}// toCurrency;


/********/


String.prototype.char_count = function (character) { return (this.match (new RegExp (character, "g")) ?? []).length }


String.prototype.extractNumber = function () {
	let result = blank;
	for (var i = 0; i < this.length; i++) {
		if (is_number (this [i])) result += this [i];
	}// for;
	return result;
}// extractNumber;


String.prototype.padded = function (length, character, direction = null) {
	let result = this;
	while (result.length < length) {
		switch (direction) {
			case directions.left: result = character + result; break;
			default: result += character; break;
		}// switch;
	}// while;
	return result.toString ();
}// padded;


String.prototype.equals = function (comparison, case_sensitive = false) {
	if (is_null (comparison)) return false;
	return ((case_sensitive ? this : this.toLowerCase ()).trim () == (case_sensitive ? comparison : comparison.toLowerCase ()).trim ());
}// equals;


String.prototype.empty = function () { return this.trim () == blank }
String.prototype.not_empty = function () { return !this.empty () }


String.prototype.matches = function (pattern) { return isset (this.match (pattern)) }


String.prototype.splice = function (start_index, end_index, replacement = null) {

	let start = is_number (start_index) ? parseInt (start_index) : null;
	let finish = is_number (end_index) ? parseInt (end_index) : null;

	if (is_null (start) || is_null (finish) || (finish > start)) return this;

	return `${this.substring (0, start)}${replacement}${this.substring (finish)}`;
	
}// splice;


String.prototype.titled = function () { return this.charAt (0).toUpperCase () + this.slice (1) }


/**** Window Prototype ****/


Window.prototype.dispatchAll = (event) => document.querySelectorAll ("*").forEach (item => item.dispatchEvent (is_string (event) ? new Event (event) : event));



