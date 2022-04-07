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
	}/* key_handler */;


	/********/


	valid_number () {

		if (this.type != "number") return null;

		const number_length = (value) => { return common.isset (value) ? value.toString ().length : null }

		let min_value = this.getNumber ("min");
		let max_value = this.getNumber ("max");

		let min_length = common.next_integer (this.getAttribute ("length"), this.getAttribute ("minLength"), number_length (min_value));
		let max_length = common.next_integer (this.getAttribute ("length"), this.getAttribute ("maxLength"), number_length (max_value));

		let value = parseInt (this.value);
	
		if (common.isset (min_value) && (value < min_value)) return this.setValidity (false, `Value must be greater than ${min_value}.`);
		if (common.isset (max_value) && (value > max_value)) return this.setValidity (false, `Value must be less than ${max_value}.`);

		if (common.isset (min_length) && (this.value.length < min_length)) return this.setValidity (false, `Value cannot be less than ${min_length} digits.`);
		if (common.isset (max_length) && (this.value.length > max_length)) return this.setValidity (false, `Value cannot be more than ${max_length} digits.`);

		return true;

	}/* valid_number */;


	/********/


	componentDidMount () {

		if (common.isset (this.props.minLength)) this.input_field.current.minLength = common.next_integer (this.props.minLength);
		if (common.isset (this.props.maxLength)) this.input_field.current.maxLength = common.next_integer (this.props.maxLength);

		this.input_field.current.addValidator (this.valid_number.bind (this.input_field.current));

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