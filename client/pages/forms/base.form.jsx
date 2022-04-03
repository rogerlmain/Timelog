import * as common from "classes/common";

import React from "react";
import BaseControl from "controls/abstract/base.control";


export default class BaseForm extends BaseControl {

	active_form = React.createRef ();


	validate (input) {
		
		let valid = true;

		if (input.hasAttribute ("required") && input.value.empty ()) valid = false;
		if (common.isset (input.validate) && (!input.validate (input))) valid = false;

		switch (valid) {
			case true: input.removeClass ("invalid"); break;
			default: input.addClass ("invalid"); break;
		}// switch;

		return valid;
		
	}// validate;


	valid_form () {

		let valid = true;
		let elements = this.active_form.current.elements;

		if (common.not_set (elements)) return valid;
		for (let element of elements) if (!this.validate (element)) valid = false;

		return valid;

	}// valid_form;

}// BaseForm;