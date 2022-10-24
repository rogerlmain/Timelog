import React from "react";
import BaseControl from "../abstract/base.control";

import ExpandingInput from "client/controls/inputs/expanding.input";

import { isset, not_set } from "client/classes/common";

import "resources/styles/controls.css";


const input_style = { 
	cursor: "pointer",
	textAlign: "right",
	caretColor: "transparent",
}/* input_style */


export default class CurrencyInput extends BaseControl {


	static defaultProps = { 

		id: null,
		className: null,
		defaultValue: null,

		onBlur: null,
		onChange: null,

		maxLength: null,

	}// default_props;


	constructor (props) {
		super (props);
		if (not_set (props.id)) throw "CurrencyInput requires an ID";
	}// constructor;


	/********/


	currency_input = React.createRef ();
	state = { current_value: 0 }


	/********/


	process_keystroke = event => {

		const keycode = event.which ?? event.keyCode;

		let new_value = null;

		if (["backspace", "delete"].includes (event.key.toLowerCase ())) new_value = Math.floor (this.state.current_value / 10);

		switch (isFinite (event.key)) {
			case true: new_value = (this.state.current_value * 10) + parseInt (event.key); break;
			default: if ((keycode > 32) || (keycode == 8)) event.preventDefault ();
		}// switch;

		if (isset (this.props.maxLength) && (new_value.toString ().length > this.props.maxLength)) return !!event.preventDefault ();

		this.setState ({ current_value: new_value });

	}// process_keystroke;

	
	/********/


	shouldComponentUpdate (new_props) {
		if (new_props.defaultValue != this.props.defaultValue) return !!this.setState ({ current_value: new_props.defaultValue });
		return true;
	}// shouldComponentUpdate;


	render = () => {

		let properties = {...this.props};

		delete properties.name;
		delete properties.type;
		delete properties.defaultValue;

		return <div className="currency-input">
			<ExpandingInput {...properties} name={this.props.id} ref={this.currency_input} readOnly={true} stretchOnly={true}
				value={this.state.current_value.toCurrency ()} onKeyDown={this.process_keystroke} style={input_style}
				onBlur={event => this.execute (this.props.onBlur, {...event, value: this.state.current_value })}>
			</ExpandingInput>
		</div>

	}// render;

}// CurrencyInput;