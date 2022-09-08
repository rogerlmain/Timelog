import React from "react";

import Calendar from "react-calendar";

import BaseControl from "client/controls/abstract/base.control";
import TimePicker from "client/controls/time.picker";

import Container from "client/controls/container";
import ToggleButton from "client/controls/toggle.button";
import ToggleSwitch from "client/controls/toggle.switch";

import { boundaries } from "client/classes/storage/options.storage";

import "react-clock/dist/Clock.css";
import "resources/styles/pages/gadgets/calendar.clock.css";


export default class CalendarClock extends BaseControl {

	static defaultProps = { 
		id: "calendar_clock",
		start: null,
		end: null,
		visible: true,
		onChange: null
	}// defaultProps;


	state = { boundary: boundaries.end }


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


	/********/


	calendar = React.createRef ();


	render () {
		return <Container visible={this.props.visible} id={this.props.id}>

			<div className="three-column-grid boundary-toggle-switch">
				<ToggleButton htmlFor="log_boundary_start" className="fully-centered">Start</ToggleButton>
				<ToggleSwitch id="log_boundary_toggle" value={boundaries.end} onChange={data => this.setState ({ boundary: data })}>
					<option id="log_boundary_start" value={boundaries.start}>Start</option>
					<option id="log_boundary_end" value={boundaries.end}>End</option>
				</ToggleSwitch>
				<ToggleButton htmlFor="log_boundary_end" className="fully-centered">End</ToggleButton>
			</div>

			<div className="two-column-grid date-time-controls">

				<Calendar id="calendar_object" ref={this.calendar} calendarType="US" selectRange={false} 
					value={this.props [this.state.boundary]} 
					onChange={value => this.execute (this.props.onChange, {
						date: this.date_value (value),
						boundary: this.state.boundary
					})}>
				</Calendar>

				<TimePicker id="time_picker" defaultValue={this.props [this.state.boundary]}
					onChange={value => this.execute (this.props.onChange, {
						date: value,
						boundary: this.state.boundary
					})}>
				</TimePicker>

			</div>

		</Container>
	}// render;

}// CalendarClock;


