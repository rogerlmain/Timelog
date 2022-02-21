import { directions } from "types/constants";

import * as common from "classes/common";
import { Dimensions } from "./datatypes";
import { Component } from "react";

// import { Component } from "react";
// import React from "react";



declare global {


	interface Array<T> {
		insert (item: any, index: number): void;
		prepend (item: any): void;
		remove (element: any): void;
	}// array;


	interface FormData {
		toObject (): any;
		toJson (): string;
	}// FormData;


	interface HTMLElement {
		availableWidth (): number;
		availableHeight (): number;
		freeze (): void;
		property (property_name: string): any;
		visible (): boolean;
	}// HTMLElement;


	interface HTMLSelectElement {
		selectedValue (): void;
	}// HTMLSelectElement;


	interface Number {
		padded (length: number): String;
	}// Number;


	interface String {
		padded (length: number, character: any, direction?: any): string;
		matches (comparison: string, case_sensitive?: boolean): boolean;
	}// String;

}// global;


/**** Global ****/


Array.prototype.insert = function (item: any, index: number) {
    this.splice (index, 0, item);
}// insert;


Array.prototype.prepend = function (item: any) {
	this.insert (item, 0);
}// prepend;


Array.prototype.remove = function (element: any) {
	let index = this.indexOf (element);
	if (index < 0) return;
	this.splice (index, 1);
}// remove;


/********/


FormData.prototype.toObject = function () {
	let result: any = {}
	this.forEach ((value: any, key: string) => result [key] = value);
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
	let dimensions: Dimensions = {
		width: this.offsetWidth,
		height: this.offsetHeight
	}// dimensions;
	if (dimensions.width != null) this.style.width = `${dimensions.width}px`;
	if (dimensions.height != null) this.style.height = `${dimensions.height}px`;
	return dimensions;
}// freeze;


HTMLElement.prototype.property = function (property_name: string): any {
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
	return (this.children [this.selectedIndex] as HTMLOptionElement).value;
}// selectedValue;


/********/


Number.prototype.padded = function (length: number) {
	return this.toString ().padded (length, "0", directions.left);
}// if;


/********/


String.prototype.padded = function (length: number, character: any, direction: any = null) {
	let result = this;
	while (result.length < length) {
		switch (direction) {
			case directions.left: result = character + result; break;
			default: result += character; break;
		}// switch;
	}// while;
	return result.toString ();
}// padded;


String.prototype.matches = function (comparison: string, case_sensitive: boolean = false) {
	if (common.is_null (comparison)) return false;
	return ((case_sensitive ? this : this.toLowerCase ()).trim () == (case_sensitive ? comparison : comparison.toLowerCase ()).trim ());
}// matches;


