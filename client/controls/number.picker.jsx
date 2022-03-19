import React from "react";
import BaseControl from "controls/base.control";
import NumberInput from "controls/number.input";

import { is_number } from "classes/common";

import "client/resources/styles/controls/number.picker.css";


export default class NumberPicker extends BaseControl {

	static defaultProps = { 
		value: 0,
		min: null,
		max: null,
		loop: false,
		padding: 0,
		onChange: null
	}// defaultProps;


	state = { value: 0 }


	constructor (props) {
		super (props);
		this.state.value = props.value;
	}// constructor;


	save_selection (selection) {
		this.setState ({ value: selection }, () => this.execute (this.props.onChange, {
			old_value: this.state.value,
			new_value: selection
		}));
	}// save_selection;


	update_value (increment) {

		let new_value = parseInt (this.state.value) + increment;

		if (is_number (this.props.min) && (new_value < this.props.min)) {
			if (this.props.loop) new_value = this.props.max;
			else return;
		}// if;

		if (is_number (this.props.max) && (new_value > this.props.max)) {
			if (this.props.loop) new_value = this.props.min;
			else return;
		}// if;

		this.save_selection (new_value);

	}// update_value;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ value: new_props.value });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {

		return <div className="number-picker">
			<div className="up-arrow" onClick={() => this.update_value (1)} />
			<NumberInput value={this.state.value.padded (this.props.padding)} min={this.props.min} max={this.props.max} onChange={data => this.save_selection (data.new_value)} />
			<div className="down-arrow" onClick={() => this.update_value (-1)} />
		</div>
	}// render;

}// NumberPicker;