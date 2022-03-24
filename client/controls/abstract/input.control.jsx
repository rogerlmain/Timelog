import BaseControl from "controls/abstract/base.control";

import { asterisk, blank } from "classes/types/constants";
import { is_blank } from "classes/common";


export const mask_character = asterisk;


export default class InputControl extends BaseControl {


	stripped (value) {

		let result = blank;

		for (let i = 0; i < value.length; i++) {
			let next_char = value.charAt (i);
			if (is_blank (next_char.trim ()) || isNaN (next_char)) continue;
			result += next_char;
		}// for;

		return result;

	}/* stripped */;


	masked (value, mask) { 

		let data = this.stripped (value);
		let new_value = mask;

		while (data.length > 0) {
			new_value = new_value.replace (mask_character, data.charAt (0));
			data = data.substring (1);
		}// while;

		return new_value;

	}/* masked */;


}// InputControl;