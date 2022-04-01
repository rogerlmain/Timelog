import BaseControl from "controls/abstract/base.control";


export default class BaseForm extends BaseControl {

	validate () {
		let options = Array.from (arguments);
		alert (this);
	}// validate;

}// AddressForm;