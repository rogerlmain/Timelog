import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";
import InputControl from "controls/abstract/input.control";
import Container from "controls/container";


export default class NumericInput extends InputControl {


	input_field = React.createRef ();


	static defaultProps = {

		id: null,
		name: null,
		min: null,
		max: null,

		minLength: null,
		maxLength: null,
		length: null, 		// shorthand for the same maxLength and minLength

		required: false,

		placeholder: constants.blank,

		onValidate: null

	}/* defaultProps */;


	get_length = (extremity) => { return common.next_integer (this.props.length, this.props [`${extremity}Length`], common.isset (this.props [extremity]) ? this.props [extremity].toString ().length : null ) }


	key_handler = event => {
		let max_length = this.get_length ("max");
		if ((event.key.length == 1) && (common.isset (max_length) && (event.target.value.length + 1 > max_length))) event.preventDefault ();
	}// key_handler;


	validate_entry = event => {

		let min_length = this.get_length ("min");
		let max_length = this.get_length ("max");

		if ((event.target.value.length >= min_length) && (event.target.value.length <= max_length))  return event.target.setCustomValidity (constants.blank);

		if (common.is_number (this.props.length)) return event.target.setCustomValidity (`Number must be ${this.props.length} digits long`);
		if (common.is_number (min_length) && (string_length < min_length)) return event.target.setCustomValidity (`Number must be at least ${min_length} digits`);
		if (common.is_number (max_length) && (string_length > max_length)) return event.target.setCustomValidity (`Number cannot be more than must be at least ${min_length} digits`);

	}// validate_entry;


	/********/


	componentDidMount () {

		if (common.isset (this.props.minLength)) this.input_field.current.minLength = common.next_integer (this.props.minLength);
		if (common.isset (this.props.maxLength)) this.input_field.current.maxLength = common.next_integer (this.props.maxLength);

		this.input_field.current.addValidator (this.validate_entry);

	}// componentDidMount;


	render () { 
		return <Container>
			<input type="number" id={this.props.id} name={this.props.name ?? this.props.id} ref={this.input_field}
				minLength={this.props.minLength} maxLength={this.props.maxLength} length={this.props.length}
				required={this.props.required} placeholder={this.props.placeholder}
				className="numeric-input" style={{ width: `${this.get_length ("max")}rem` }}

				min={this.props.min} max={this.props.max}

				onKeyDown={this.key_handler} {...this.inherited_properties ()}>
			</input>
		</Container>
	}// render;

}// NumericInput;