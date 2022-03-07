import { directions, empty } from "types/constants";

import { is_null } from "classes/common";


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


/**** Date Helper Items ****/


Date.minute_coef = 60000;
Date.hour_coef = Date.minute_coef * 60;
Date.day_coef = Date.hour_coef * 24;


Date.formats = {
	full_date: "w, MMMM d, yyyy",
	full_timestamp: "w, MMMM d, yyyy - H:mm ap",

	database_date: "yyyy-MM-dd",
	database_timestamp: "yyyy-MM-dd HH:mm"
}// formats;


Date.rounding_direction = {
	up		: "up",
	down	: "down"
}// rounding_direction;


Date.is_date = (candidate) => { return (candidate instanceof Date) }
Date.not_date = (candidate) => { return !this.is_date (candidate) }


Date.elapsed = function (elapsed_time) {

	let days = Math.floor (elapsed_time / Date.day_coef);
	let hours = Math.floor ((elapsed_time - (days * Date.day_coef)) / Date.hour_coef);
	let mins = Math.floor ((elapsed_time - ((days * Date.day_coef) + (hours * Date.hour_coef))) / Date.minute_coef);

	return `${((days > 0) ? `${days}:` : empty)}${((days > 0) ? hours.padded (2) : hours)}:${mins.padded (2)}`;

}// elapsed;


Date.fromGMT = function (date_string) { return new Date (new Date (date_string).toLocaleString ()).format (Date.formats.database_timestamp) }

Date.month_name = (month) => { return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month] }


Date.validated = (date) => {
	if (is_string (date)) date = new Date (date);
	return (Date.is_date (date)) ? date : null;
}// validated;


/**** Date Prototype Functions ****/


Date.prototype.get_date = (date) => { return new Date (this.format (date, Date.formats.database_date)) }
Date.prototype.get_month = (date) => { return isset (date = this.validated (date)) ? date.getMonth () : null }
Date.prototype.get_year = (date) => { return isset (date = this.validated (date)) ? date.getFullYear () : null }


Date.prototype.round_hours = function (direction) {

	let result = new Date (this);

	if (direction == Date.rounding_direction.up) result.setHours ((result.getMinutes () == 0) ? result.getHours () : result.getHours () + 1); 

	result.setMinutes (0);
	result.setSeconds (0);
	result.setMilliseconds (0);

	return result;

}// round_hours;


Date.prototype.same_day = function (date_one, date_two) {

	date_one = Date.validated (date_one);
	date_two = Date.validated (date_two);

	if (is_null (date_one) || is_null (date_two)) return false;
	
	if (date_one.getDate () != date_two.getDate ()) return false;
	if (date_one.getMonth () != date_two.getMonth ()) return false;
	if (date_one.getFullYear () != date_two.getFullYear ()) return false;

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

	return selected_format.replace ("MMMM", "!!").replace ("w", "@@").
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


/********/


FormData.prototype.toObject = function () {
	let result = {}
	this.forEach ((value, key) => result [key] = value);
	return result;
}// toObject;


FormData.prototype.toJson = function () {
	return JSON.stringify (this.toObject ());
}// toJson;


/**** HTMLElement ****/


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
	let dimensions = {
		width: this.offsetWidth,
		height: this.offsetHeight
	}// dimensions;
	if (dimensions.width != null) this.style.width = `${dimensions.width}px`;
	if (dimensions.height != null) this.style.height = `${dimensions.height}px`;
	return dimensions;
}// freeze;


HTMLElement.prototype.property = function (property_name) {
	return getComputedStyle (this).getPropertyValue (property_name);
}// property;


HTMLElement.prototype.visible = function () {
	if (this.style.display.matches ("none")) return false;
	if (this.style.visibility.matches ("hidden")) return false;
	if (parseInt (this.style.opacity) == 0) return false;
	return true;
}// if;


/********/


HTMLSelectElement.prototype.selectedValue = function () {
	return (this.children [this.selectedIndex]).value;
}// selectedValue;


/********/


Number.prototype.padded = function (length) {
	return this.toString ().padded (length, "0", directions.left);
}// if;


/********/


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


String.prototype.matches = function (comparison, case_sensitive = false) {
	if (is_null (comparison)) return false;
	return ((case_sensitive ? this : this.toLowerCase ()).trim () == (case_sensitive ? comparison : comparison.toLowerCase ()).trim ());
}// matches;

