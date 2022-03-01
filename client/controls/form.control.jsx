import "types/prototypes";

import BaseControl from "client/controls/base.control";


export default class FormControl extends BaseControl {


	static defaultProps = { formData: null }


	validate (form) {
		for (let field of form.current) {
			if (field.required && common.is_empty (field.value)) return false;
		};
		return true;
	}// validate;
	

}// BaseControl;


