import * as constants from "client/classes/types/constants";
import * as common from "client/classes/common";

import React from "react";
import InputMask from "react-input-mask";

import InputControl from "client/controls/abstract/input.control";
import Container from "client/controls/container";


const pattern_group = {
	north_america	: [32, 189],
	australia		: [10]
}// number_patterns;


const pattern_mask = {
	north_america	: "+1 (999) 999-9999",
	australia		: "+62 (99) 9999-9999"
}// pattern_masks;


const pattern_validator = {
	north_america	: "\\+1\\s\\([\\d]{3}\\)\\s[\\d]{3}-[\\d]{4}",
	australia		: "\\+62\\s\\([\\d]{2}\\)\\s[\\d]{4}-[\\d]{4}"
}// pattern_validator;


export default class PhoneNumberInput extends InputControl {


	state = { 
		mask: pattern_mask.north_america, 
		input_field: null,
	}/* state */;

	static defaultProps = { 
		country_id: null,
		defaultValue: null
	}/* defaultProps */


	/********/


	validators = () => {
		let is_required = this.props.required || (common.isset (this.state.input_field) && this.state.input_field.notComplete (this.state.mask));
		return {
			required: is_required,
			pattern:  (is_required ? pattern_validator [this.group_name (this.props.country_id)] : null)
		}// return;
	}// validators;


	update_pattern = (event) => {

		let validator = this.validators ();

		switch (validator.required) {
			case true: event.target.setAttributes ({ "required": "true", "pattern": validator.pattern }); break;
			default: event.target.removeAttributes ("required", "pattern"); break;
		}// if;

		event.target.validate ();

		return true;

	}// update_pattern;


	/********/


	group_name (country_id) {
		for (let key in pattern_group) {
			if (pattern_group [key].includes (country_id)) return key;
		}// for;
		return null;
	}// group_name;


	/********/


	componentDidMount () {
		this.setState ({ 
			mask: pattern_mask.north_america,
			input_field: this.input_field.current.getInputDOMNode ()
		});
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		let country_id = parseInt (new_props.country_id);
		if (country_id != this.props.country_id) {
			this.setState ({ mask: pattern_mask [this.group_name (country_id)] });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () { 
		let validators = this.validators ();
		return <Container>
			<InputMask id={this.props.id} name={this.props.name} ref={this.input_field} defaultValue={this.props.defaultValue ?? constants.blank}
				mask={this.state.mask} input_mask={this.state.mask} maskChar="*" alwaysShowMask={true} 
				style={{ textAlign: "center" }} required={validators.required} pattern={validators.pattern}
				onChange={this.update_pattern}>
			</InputMask>
		</Container>
	}// render;

}// PhoneNumberInput;