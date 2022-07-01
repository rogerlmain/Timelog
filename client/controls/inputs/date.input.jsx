import React from "react";
import Calendar from "react-calendar";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";

import calendar_glyph from "resources/images/glyphs/calendar.glyph.svg";

import { is_null } from "client/classes/common";
import { date_formats } from "client/classes/types/constants";


export default class DateInput extends BaseControl {


	state = { 
		calendar_visible: false,
		value: null,
	}// state;


	static defaultProps = { id: "date_field" }


	/********/


	selected_date = () => { 
		if (is_null (this.state.value)) this.state.value = new Date ();
		return this.state.value.format (date_formats.full_date);
	}// selected_date;


	/********/


	render () {
		return <div style={{ position: "relative" }}>

<FadePanel id={this.props.id} visible={this.state.calendar_visible}>
			<div 
				style={{

					backgroundColor: "var(--background-color)",
					border: "solid 1px black",
					borderRadius: "1em",
					padding: "1em",
					position: "absolute",
					zIndex: 1,

				}}>
					<Calendar id="select_calendar" />
			</div>
			</FadePanel>

			<input id={this.props.id} type="text" readOnly={true} value={this.selected_date ()} />

			<img src={calendar_glyph} style={{
				width: "auto",
				height: "1.3em",
				position: "absolute",
				right: "1em",
				top: "0.35em",
				cursor: "pointer",
			}} onClick={() => this.setState ({ calendar_visible: true })} />

		</div>
	}// render;


}// DateInput;