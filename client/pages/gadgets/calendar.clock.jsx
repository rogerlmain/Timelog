import React from "react";

import Calendar from "react-calendar";

import BaseControl from "controls/base.control";
import TimePicker from "controls/time.picker";

import Container from "controls/container";
import ToggleButton from "client/controls/toggle.button";
import ToggleSwitch from "client/controls/toggle.switch";

import { log_entry_boundaries } from "classes/storage/options";

import "client/resources/styles/pages/gadgets/calendar.clock.css";
import 'react-clock/dist/Clock.css';


export default class CalendarClock extends BaseControl {

	static defaultProps = { 
		id: "calendar_clock",
		start: null,
		end: null,
		visible: true,
		onChange: null
	}// defaultProps;


	state = { boundary: log_entry_boundaries.end }
	

	render () {
		return (
			<Container condition={this.props.visible} id={this.props.id} inline={true}>

				<div className="three-column-grid boundary-toggle-switch">
					<ToggleButton htmlFor="log_boundary_start" className="centering-container">Start</ToggleButton>
					<ToggleSwitch id="log_boundary_toggle" value={log_entry_boundaries.end} onChange={data => this.setState ({ boundary: data.option })}>
						<option id="log_boundary_start" value={log_entry_boundaries.start}>Start</option>
						<option id="log_boundary_end" value={log_entry_boundaries.end}>End</option>
					</ToggleSwitch>
					<ToggleButton htmlFor="log_boundary_end" className="centering-container">End</ToggleButton>
				</div>

				<div className="two-column-grid date-time-controls">
					<Calendar id="test_calendar" value={this.props [this.state.boundary]} onChange={()=>alert ("changed")} />
					<TimePicker id="time_picker" value={this.props [this.state.boundary]} onChange={()=>alert ("changed")} />
				</div>

			</Container>
		);
	}// render;

}// CalendarClock;


