import { directions } from "types/constants";

import * as common from "classes/common";
import { Dimensions } from "./datatypes";
import { Component } from "react";




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
	if (common.is_null (comparison)) return false;
	return ((case_sensitive ? this : this.toLowerCase ()).trim () == (case_sensitive ? comparison : comparison.toLowerCase ()).trim ());
}// matches;


