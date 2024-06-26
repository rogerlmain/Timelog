import React from "react";
import Clock from "react-clock";

import OptionStorage from "client/classes/storage/options.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import NumberPicker from "client/controls/number.picker";

import { granularity_types } from "client/classes/types/constants";

import "resources/styles/controls/time.picker.css";


export default class TimePicker extends BaseControl {


	state = { value: null }


	static defaultProps = { 
		granularity: granularity_types.hourly,
		defaultValue: null,
		onChange: null,
	}// defaultProps;


	constructor (props) {
		super (props);
		this.state.value = this.props.defaultValue;
	}/* constructor */;


	update_time (part, value) {

		let new_time = new Date (this.state.value);

		if (part == Date.parts.meridian) {
			if ((value == Date.meridians.am) && (new_time.getHours () > 11)) new_time = new_time.add (Date.parts.hours, -12);
			if ((value == Date.meridians.pm) && (new_time.getHours () < 12)) new_time = new_time.add (Date.parts.hours, 12);
		} else {
			new_time = new_time.add (Date.parts [part], value);
		}// if;

		this.setState ({ value: new_time }, () => this.execute (this.props.onChange, new_time));

	}// update_time;


	/********/


	shouldComponentUpdate (new_props) {
		if (new_props.defaultValue != this.props.defaultValue) return !!this.setState ({ value: new_props.defaultValue });
		return true;
	}// shouldComponentUpdate;


	render () {

		let granularity = OptionStorage.granularity ();

		let column_class = () => {
			switch (granularity) {
				case granularity_types.hourly: return "two-column-grid";
				case granularity_types.truetime: return "four-column-grid";
				default: return "three-column-grid";
			}// switch;
		}/* column_class */;

		return <div className="top-centered">
			
			<Clock id="test_clock" value={this.state.value} renderSecondHand={false} />

			<div className={`time-picker ${column_class ()}`}>

				<NumberPicker id="hours" min="1" max="12" 
					value={this.state.value?.get_hours ()} loop={true}
					onChange={data => this.update_time (Date.parts.hours, data.change )}>
				</NumberPicker>

				<Container visible={granularity != granularity_types.hourly}>
					<NumberPicker id="minutes" min="0" max="59" step={granularity == granularity_types.quarterly ? 15 : 1}
						value={this.state.value?.getMinutes ()} loop={true} padding={2}
						onChange={data => this.update_time (Date.parts.minutes, data.change )}>
					</NumberPicker>
				</Container>

				<Container visible={granularity == granularity_types.truetime}>
					<NumberPicker id="minutes" min="0" max="59"
						value={this.state.value?.getSeconds ()} loop={true} padding={2}
						onChange={data => this.update_time (Date.parts.seconds, data.change )}>
					</NumberPicker>
				</Container>

				<div className="vertically-centered meridian">
					<div onClick={() => this.update_time (Date.parts.meridian, Date.meridians.am)} className={`fully-centered ${this.state.value?.morning ? "selected" : null}`}>am</div>
					<div onClick={() => this.update_time (Date.parts.meridian, Date.meridians.pm)} className={`fully-centered ${this.state.value?.afternoon ? "selected" : null}`}>pm</div>
				</div>

			</div>

		</div>
	}// render;

}// TimePicker;