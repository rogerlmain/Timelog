import React from "react";

import Calendar from "react-calendar";

import BaseControl from "controls/abstract/base.control";
import TimePicker from "controls/time.picker";

import Container from "controls/container";
import ToggleButton from "client/controls/toggle.button";
import ToggleSwitch from "client/controls/toggle.switch";

import { boundaries } from "classes/storage/options";

import "react-clock/dist/Clock.css";
import "client/resources/styles/pages/gadgets/calendar.clock.css";


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
		let original_date = new Date (this.props [this.state.boundary]);
		original_date.setFullYear (new_date.getFullYear ());
		original_date.setMonth (new_date.getMonth ());
		original_date.setDate (new_date.getDate ());
		return original_date;
	}// date_value;


	time_value (new_time) {
		let original_time = new Date (this.props [this.state.boundary]);
		original_time.setHours (new_time.getHours ());
		original_time.setMinutes (new_time.getMinutes ());
		return original_time;
	}// time_value;


	render () {
		return (
			<Container condition={this.props.visible} id={this.props.id} inline={true}>

				<div className="three-column-grid boundary-toggle-switch">
					<ToggleButton htmlFor="log_boundary_start" className="centering-container">Start</ToggleButton>
					<ToggleSwitch id="log_boundary_toggle" value={boundaries.end} onChange={data => this.setState ({ boundary: data })}>
						<option id="log_boundary_start" value={boundaries.start}>Start</option>
						<option id="log_boundary_end" value={boundaries.end}>End</option>
					</ToggleSwitch>
					<ToggleButton htmlFor="log_boundary_end" className="centering-container">End</ToggleButton>
				</div>

				<div className="two-column-grid date-time-controls">

					<Calendar id="test_calendar" calendarType="US" selectRange={false} 
						value={this.props [this.state.boundary]} 
						onChange={value => this.execute (this.props.onChange, {
							date: this.date_value (value),
							boundary: this.state.boundary
						})}>
					</Calendar>

					<TimePicker id="time_picker" value={this.props [this.state.boundary]}
						onChange={value => this.execute (this.props.onChange, {
							date: this.time_value (value),
							boundary: this.state.boundary
						})}>
					</TimePicker>

				</div>

			</Container>
		);
	}// render;

}// CalendarClock;


