import { directions } from "constants";


declare global {


	interface FormData {
		toObject (): any;
		toJson (): string;
	}// FormData;


	interface HTMLElement {
		visible (): boolean;
		freeze (): void;
	}// HTMLElement;


	interface HTMLSelectElement {
		selectedValue (): void;
	}// HTMLSelectElement;


	interface Array<T> {
		remove (element: any): void;
	}// array;


	interface String {
		padded (length: number, character: any, direction?: any): string;
		matches (comparison: string, case_sensitive?: boolean): boolean;
	}// String;


	interface Number {
		padded (length: number): String;
	}// Number;

}// global;


FormData.prototype.toObject = function () {
	let result = {}
	this.forEach ((value: any, key: string) => result [key] = value);
	return result;
}// toObject;


FormData.prototype.toJson = function () {
	return JSON.stringify (this.toObject ());
}// toJson;


/********/


HTMLElement.prototype.visible = function () {
	if (this.style.display.matches ("none")) return false;
	if (this.style.visibility.matches ("hidden")) return false;
	if (parseInt (this.style.opacity) == 0) return false;
	return true;
}// if;


HTMLElement.prototype.freeze = function () {
	let dimensions = {
		width: this.offsetWidth,
		height: this.offsetHeight
	}// dimensions;
	if (dimensions.width != null) this.style.width = `${dimensions.width}px`;
	if (dimensions.height != null) this.style.height = `${dimensions.height}px`;
	return dimensions;
}// freeze;


HTMLSelectElement.prototype.selectedValue = function () {
	return this.children [this.selectedIndex].value;
}// selectedValue;


/********/


Array.prototype.remove = function (element: any) {
	let index = this.indexOf (element);
	if (index < 0) return;
	this.splice (index, 1);
}// remove;


String.prototype.padded = function (length: number, character: any, direction: any = null) {
	let result = this;
	while (result.length < length) {
		switch (direction) {
			case directions.left: result = character + result; break;
			default: result += character; break;
		}// switch;
	}// while;
	return result;
}// padded;


String.prototype.matches = function (comparison: string, case_sensitive: boolean = false) {
	return ((case_sensitive ? this : this.toLowerCase ()).trim () == (case_sensitive ? comparison : comparison.toLowerCase ()).trim ());
}// matches;


/********/


Number.prototype.padded = function (length: number) {
	return this.toString ().padded (length, "0", directions.left);
}// if;


/********/

