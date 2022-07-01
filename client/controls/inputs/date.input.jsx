import React from "react";

import BaseControl from "client/controls/abstract/base.control";

import { is_null } from "client/classes/common";
import { date_formats } from "client/classes/types/constants";


export default class DateInput extends BaseControl {


	state = { value: null }


	static defaultProps = { id: "date_field" }


	/********/


	selected_date = () => { 
		if (is_null (this.state.value)) this.state.value = new Date ();
		return this.state.value.format (date_formats.full_date);
	}// selected_date;


	/********/


	render () {
		return <input id={this.props.id} type="text" readOnly={true} value={this.selected_date ()} />
	}// render;


}// DateInput;