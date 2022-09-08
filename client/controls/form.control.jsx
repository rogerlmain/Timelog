import "client/classes/types/prototypes";
import BaseControl from "client/controls/abstract/base.control";
import { is_empty } from "client/classes/common";


export default class FormControl extends BaseControl {

	static defaultProps = { formData: null }

	validate (form) {
		for (let field of form.current) {
			if (field.required && is_empty (field.value)) return false;
		};
		return true;
	}// validate;

}// BaseControl;
