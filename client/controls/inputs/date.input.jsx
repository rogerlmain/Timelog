import React from "react";
import Calendar from "react-calendar";

import BaseControl from "client/controls/abstract/base.control";

import FadePanel from "client/controls/panels/fade.panel";

import calendar_glyph from "resources/images/glyphs/calendar.glyph.svg";

import { is_null, notify } from "client/classes/common";
import { date_formats } from "client/classes/types/constants";

import "resources/styles/controls/date.input.css";


export default class DateInput extends BaseControl {


	staging_panel = React.createRef ();
	input_field = React.createRef ();


	state = { 
		calendar_visible: false,
		value: null,
	}// state;


	static defaultProps = { 
		id: "date_field",
		onChange: null,
	}// defaultProps;


	/********/


	selected_date = () => { 
		if (is_null (this.state.value)) this.state.value = new Date ();
		return this.state.value.format (date_formats.full_date);
	}// selected_date;


	/********/


	render () {
		return <div className="date-input">

			<FadePanel id={`${this.props.id}_fade_panel`} visible={this.state.calendar_visible}>
				<div className="calendar">
					<Calendar id="select_calendar" calendarType="US" onChange={selected_date => this.setState ({ 
						calendar_visible: false,
						value: selected_date,
					}, () => this.props.onChange (selected_date) )} />
				</div>
			</FadePanel>

			<div id={this.props.id} name={this.props.id} className="bordered" style={{ 
				display: "inline-flex",
				height: "2.05em",
				padding: "0 3em 0 0.7em",
				alignItems: "center",
			}}>{this.selected_date ()}</div>

			<img src={calendar_glyph} onClick={() => this.setState ({ calendar_visible: true })} />

		</div>
	}// render;


}// DateInput;