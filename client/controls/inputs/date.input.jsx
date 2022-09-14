import React from "react";
import Calendar from "react-calendar";

import BaseControl from "client/controls/abstract/base.control";

import FadePanel from "client/controls/panels/fade.panel";
import PopupPanel from "client/controls/panels/popup.panel";

import calendar_glyph from "resources/images/glyphs/calendar.glyph.svg";

import { is_null, notify, not_set } from "client/classes/common";
import { date_formats } from "client/classes/types/constants";

import "resources/styles/controls/date.input.css";


export default class DateInput extends BaseControl {


	staging_panel = React.createRef ();
	input_field = React.createRef ();
	popup_calendar = React.createRef ();


	state = { 
		calendar_visible: false,
		value: null,
	}// state;


	static defaultProps = { 
		id: "date_field",
		disabled: false,
		onChange: null,
	}// defaultProps;


	/********/


	selected_date = () => { 
		if (is_null (this.state.value)) this.state.value = new Date ();
		return this.state.value.format (date_formats.full_date);
	}// selected_date;


	/********/


	componentDidMount () {
		if (not_set (this.popup_calendar.current)) return;
		this.popup_calendar.current.onClick = event => {alert ("clicked"); event.stopPropagation (); }
	}// componentDidMount;


	render () {
		return <div className="date-input">

			<div id={this.props.id} style={{ cursor: this.props.disabled ? "default" : "pointer" }} 
			
				onClick={this.props.disabled ? null : event => {
					this.setState ({ calendar_visible: true });
					event.stopPropagation ();
				}}>

				<div id={`${this.props.id}_display_div`} name={this.props.id} className={`bordered ${this.props.disabled ? "disabled" : null}`} style={{ 
					display: "inline-flex",
					height: "2.05em",
					padding: "0 3em 0 0.7em",
					alignItems: "center",
				}}>{this.selected_date ()}</div>

				<FadePanel id={`${this.props.id}_glyph_fade_panel`} visible={!this.props.disabled}>
					<img src={calendar_glyph} />
				</FadePanel>

			</div>

			<PopupPanel className="calendar" visible={this.state.calendar_visible && !this.props.disabled}>
				<div className="calendar">
					<Calendar id="select_calendar" calendarType="US" onChange={selected_date => this.setState ({ 
						calendar_visible: false,
						value: selected_date,
					}, () => this.props.onChange (selected_date))} />
				</div>
			</PopupPanel>

		</div>
	}// render;


}// DateInput;