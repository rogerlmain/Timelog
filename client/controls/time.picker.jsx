import React from "react";
import Clock from "react-clock";
import NumberPicker from "controls/number.picker";

import BaseControl from "controls/base.control";

import "client/resources/styles/controls/time.picker.css";


const meridians = {
	am: "am",
	pm: "pm"
}// meridians;


const time_parts = {
	hours: "hours",
	minutes: "minutes",
	meridian: "meridian"
}// time_parts;


export default class TimePicker extends BaseControl {

	static defaultProps = { 
		value: null,
		onChange: null 
	}// defaultProps;


	meridian_time () {
	
		let military_hours = new Date (this.props.value).getHours ();
		let hours = (military_hours % 12);

		let is_morning = military_hours < 12;
		let is_afternoon = military_hours > 11;

		return {
			hours: hours ? hours : 12,
			meridian: is_morning ? meridians.am : meridians.pm,
			morning: is_morning,
			afternoon: is_afternoon
		}// return;

	}// meridian_time;


	update_time (part, value) {

		let new_time = new Date (this.props.value);

		switch (part) {
			case time_parts.hours: {
				let hours = (this.meridian_time ().morning ? value : parseInt (value) + 12);
				new_time.setHours (hours < 24 ? hours : 0);
				break;
			}// time_parts.hours;
			case time_parts.minutes: new_time.setMinutes (value); break;
			case time_parts.meridian: {
				let hours = new_time.getHours ();
				if ((value == meridians.am) && (hours > 11)) hours -= 12;
				if ((value == meridians.pm) && (hours < 12)) hours += 12;
				new_time.setHours (hours == 24 ? 0 : hours);
				break;
			}// time_parts.meridian;
		}// switch;

		this.execute (this.props.onChange, new_time);

	}// update_time;


	render () {

		let meridian_hours = this.meridian_time ();

		return <div>
			
			<Clock id="test_clock" value={this.props.value} renderSecondHand={false} />

			<div className="three-column-grid time-picker">
				<NumberPicker id="hours" min="1" max="12" value={meridian_hours.hours} onChange={data => this.update_time (time_parts.hours, data.new_value )} loop={true} />
				<NumberPicker id="minutes" min="0" max="59" value={this.props.value.getMinutes ().padded (2)} onChange={data => this.update_time (time_parts.minutes, data.new_value )} loop={true} />
				<div className="meridian">
					<div onClick={() => this.update_time (time_parts.meridian, meridians.am)} className={meridian_hours.morning ? "selected" : null}>AM</div>
					<div onClick={() => this.update_time (time_parts.meridian, meridians.pm)} className={meridian_hours.afternoon ? "selected" : null}>PM</div>
				</div>
			</div>

		</div>
	}// render;

}// TimePicker;