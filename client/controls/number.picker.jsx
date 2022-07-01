import React from "react";
import BaseControl from "controls/abstract/base.control";
import NumberRangeInput from "controls/inputs/number.range.input";

import { blank } from "classes/types/constants";
import { is_number, isset } from "classes/common";

import "resources/styles/controls/number.picker.css";


export default class NumberPicker extends BaseControl {


	state = { value: 0 }

	
	timeout = null;


	static defaultProps = { 
		value: 0,
		min: null,
		max: null,
		loop: false,
		step: 1,
		padding: 0,
		onChange: null
	}// defaultProps;


	constructor (props) {
		super (props);
		this.state.value = props.value;
	}// constructor;


	upper_limit = () => { return ((this.props.min > 0) ? (this.props.max - this.props.min) : ((this.props.max > 0) ? Math.abs (this.props.min) + Math.abs (this.props.max) : (this.props.min - this.props.max))) + 1 }


	save_selection (selection) {

		const difference = limit => {

			if (this.state.value == 0) return (selection > (limit / 2)) ? (selection - limit) : selection;
			if ((this.state.value == this.props.max) && (selection == this.props.min)) return selection;

			if (selection == 0) return (this.state.value > (limit / 2)) ? (limit - this.state.value) : (0 - this.state.value);
			if ((selection == this.props.max) && (this.props.value == this.props.min)) return (0 - this.state.value);

			return (selection - this.state.value);

		}/* difference */;

		let update_values = {
			old_value: this.state.value,
			new_value: selection,
			change: difference (this.upper_limit ()),
			overflow: ((selection == 0) && (difference > 0) ? 1 : ((this.state.value == 0) && (difference < 0) ? -1 : 0)),
		}// update_values;

		this.setState ({ value: selection }, () => this.execute (this.props.onChange, update_values));

	}// save_selection;


	update_value (increment) {

		let new_value = parseInt (this.state.value) + parseInt (increment);

		if (is_number (this.props.min) && (new_value < this.props.min)) {
			if (this.props.loop) new_value = this.upper_limit () + new_value;
			else return;
		}// if;

		if (is_number (this.props.max) && (new_value > this.props.max)) {
			if (this.props.loop) new_value = new_value - this.upper_limit ();
			else return;
		}// if;

		this.save_selection (new_value);

	}// update_value;


	set_value = (increment, delay) => {
		this.update_value (increment);
		//this.timeout = setTimeout (() => this.set_value (increment, 200), delay);
	}// set_value;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ value: new_props.value });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {
		return <div className="number-picker">

			<div className="up-arrow" onMouseDown={() => this.set_value (this.props.step, 1000)} onMouseUp={() => clearTimeout (this.timeout)} />

			<NumberRangeInput min={this.props.min} max={this.props.max} 
				value={isset (this.state.value) ? this.state.value.padded (this.props.padding) : blank} 
				onChange={data => this.save_selection (data.new_value)}>
			</NumberRangeInput>

			<div className="down-arrow" onMouseDown={() => this.set_value (-this.props.step, 1000)} onMouseUp={() => clearTimeout (this.timeout)} />

		</div>
	}// render;

}// NumberPicker;