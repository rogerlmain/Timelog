import { directions } from "components/types/constants";

if (HTMLDivElement.prototype ["freeze"] == null) HTMLDivElement.prototype ["freeze"] = function () {
	let dimensions = {
		width: this.offsetWidth,
		height: this.offsetHeight
	}// dimensions;
	if (dimensions.width != null) this.style.width = `${dimensions.width}px`;
	if (dimensions.height != null) this.style.height = `${dimensions.height}px`;
	return dimensions;
}// freeze;


if (HTMLSelectElement.prototype ["selectedValue"] == null) HTMLSelectElement.prototype ["selectedValue"] = function () {
	return this.children [this.selectedIndex].value;
}// selectedValue;


if (String.prototype ["padded"] == null) String.prototype ["padded"] = function (length: number, character: any, direction: any = null) {
	let result = this;
	while (result.length < length) {
		switch (direction) {
			case directions.left: result = character + result; break;
			default: result += character; break;
		}// switch;
	}// while;
	return result;
}// padded;


if (Number.prototype ["padded"] == null) Number.prototype ["padded"] = function (length: number) {
	return this.toString ().padded (length, "0", directions.left);
}// if;