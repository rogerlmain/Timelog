import React from "react";

import Calendar from "react-calendar";

import BaseControl from "client/controls/abstract/base.control";
import TimePicker from "client/controls/time.picker";

import Container from "client/controls/container";
import ToggleButton from "client/controls/toggle.button";
import ToggleSwitch from "client/controls/toggle.switch";

import { boundaries } from "client/classes/storage/options.storage";
import { isset } from "client/classes/common";

import "react-clock/dist/Clock.css";
import "resources/styles/gadgets/calendar.clock.css";


export default class CalendarClock extends BaseControl {


	state = { 

		values: {
			start: null,
			end: null,
		}/* values */,

		boundary: null,

	}/* state */;


	static defaultProps = { 
		id: "calendar_clock",
		start: null,
		end: null,
		visible: true,
		onChange: null,
		boundary: boundaries.start,
		showToggle: false,
	}// defaultProps;


	constructor (props) {

		super (props);

		this.state.values = {
			start: props.start,
			end: props.end,
		}/* values */;

		this.state.boundary = props.boundary;

	}/* constructor */;


	/********/


	date_value (new_date) {
		let date = new Date (this.props [this.state.boundary]);
		date.setFullYear (new_date.getFullYear ());
		date.setMonth (new_date.getMonth ());
		date.setDate (new_date.getDate ());
		return date;
	}// date_value;


	time_value (new_time) {
		let time = new Date (this.props [this.state.boundary]);
		time.setHours (new_time.getHours ());
		time.setMinutes (new_time.getMinutes ());
		time.setSeconds (new_time.getSeconds ());
		return time;
	}// time_value;


	update_datetime = new_datetime => this.setState ({ values: {
		...this.state.values,
		[this.state.boundary]: new_datetime,
	}}, () => this.execute (this.props.onChange, {
		date: new_datetime,
		boundary: this.state.boundary
	}));


	/********/


	shouldComponentUpdate (props) {
		if (props.boundary != this.state.boundary) return !!this.setState ({ boundary: props.boundary });
		return true;
	}/* shouldComponentUpdate */;


	render () {
		return <Container visible={this.props.visible} id={this.props.id}>

			{this.props.showToggle && <div className="three-column-grid boundary-toggle-switch">

				<ToggleButton htmlFor="log_boundary_start" className="fully-centered">Start</ToggleButton>

				<ToggleSwitch id="log_boundary_toggle" value={this.state.boundary} onChange={data => this.setState ({ boundary: data })}>
					<option id="log_boundary_start" value={boundaries.start}>Start</option>
					<option id="log_boundary_end" value={boundaries.end}>End</option>
				</ToggleSwitch>

				<ToggleButton htmlFor="log_boundary_end" className="fully-centered">End</ToggleButton>

			</div>}

			<div className="two-column-grid date-time-controls">

				<Calendar id="calendar_object" calendarType="US" selectRange={false} 
					value={this.state.values [this.state.boundary]} 
					onChange={value => this.update_datetime (this.date_value (value))}>
				</Calendar>

				<TimePicker id="time_picker" 
					defaultValue={this.state.values [this.state.boundary].rounded (this.state.boundary)}
					onChange={value => this.update_datetime (value)}>
				</TimePicker>

			</div>

		</Container>
	}// render;

}// CalendarClock;


