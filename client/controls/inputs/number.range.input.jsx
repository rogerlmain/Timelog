import React from "react";
import BaseControl from "controls/abstract/base.control";

import { isset, is_null, is_number } from "classes/common";

import "resources/styles/controls.css";


const default_length = 3;
const dash = "-";


export default class NumberRangeInput extends BaseControl {

	static defaultProps = {
		min: null,
		max: null,
		value: 0
	}// defaultProps;


	state = { value: 0 }


	constructor (props) {
		super (props);
		this.state.value = props.value;
	}// constructor;


	keystroke_handler (event) {

		event.preventDefault ();
		
		let digit = is_number (event.key) ? parseInt (event.key) : null;

		if (is_null (digit) && (event.key != dash)) return;

		if (event.key == dash) return this.setState ({ value: event.key });

		if (isset (digit)) {

			const in_range = (value) => { return (is_null (this.props.min) || (this.props.min <= value)) && (is_null (this.props.max) || (this.props.max >= value)) };
			
			let current_value = this.state.value;
		 	let total = parseInt (`${this.state.value}${event.key}`);
			
		 	if (in_range (total)) return this.setState ({ value: total }, () => this.execute (this.props.onChange, { new_value: total, old_value: current_value }));
		 	if (in_range (digit)) return this.setState ({ value: digit }, () => this.execute (this.props.onChange, { new_value: digit, old_value: current_value }));

		}// if;

	}// keystroke_handler;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ value: new_props.value });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	max_length () {
		let min_length = is_number (this.props.min) ? this.props.min.toString ().length : 0;
		let max_length = is_number (this.props.max) ? this.props.max.toString ().length : 0;
		let max_size = Math.max (min_length, max_length);
		if (max_size == 0) max_size = default_length;
		return max_size;
	}// max_length;


	render () {

		let max_length = this.max_length ();

		return <input className="number-input" maxLength={max_length} 
			style={{ width: `${max_length * 1.1}em` }} 
			value={this.state.value} readOnly={true}
			onKeyDown={this.keystroke_handler.bind (this)}>
		</input>
	}// render;

}// NumberRangeInput;