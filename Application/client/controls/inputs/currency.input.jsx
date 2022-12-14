import React from "react";
import BaseControl from "client/controls/abstract/base.control";

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
		this.state.current_value = this.props.defaultValue;
	}// constructor;


	/********/


	currency_input = React.createRef ();
	state = { current_value: 0 }


	/********/


	process_keystroke = event => {

		const keycode = event.which ?? event.keyCode;

		let new_value = null;
		let deleting = ["backspace", "delete"].includes (event.key.toLowerCase ());

		if (deleting) new_value = Math.floor (this.state.current_value / 10);

		switch (isFinite (event.key)) {
			case true: new_value = (this.state.current_value * 10) + parseInt (event.key); break;
			default: if ((keycode > 32) || (keycode == 8)) event.preventDefault ();
		}// switch;

		if ((!deleting) && isset (this.props.maxLength) && (new_value?.toString ().length > this.props.maxLength)) return !!event.preventDefault ();
		if (isset (new_value)) this.setState ({ current_value: new_value });

	}// process_keystroke;

	
	/********/


	shouldComponentUpdate (new_props) {
		if (new_props.defaultValue != this.props.defaultValue) return !!this.setState ({ current_value: new_props.defaultValue });
		return true;
	}// shouldComponentUpdate;


	render = () => {

		let props = {...this.props};

		delete props.id
		delete props.name;
		delete props.type;
		delete props.defaultValue;

		return <div className="currency-input">
			<ExpandingInput {...props} id={this.props.id} name={this.props.id} key={`${this.props.id}_currency_input`} 
				ref={this.currency_input}  readOnly={true} stretchOnly={true}
				value={this.state.current_value.toCurrency ()} onKeyDown={this.process_keystroke} style={input_style}
				onBlur={event => this.execute (this.props.onBlur, {...event, value: this.state.current_value })}
				onChange={value => this.execute (this.props.onChange, value.fromCurrency ())}>
			</ExpandingInput>
		</div>

	}// render;

}// CurrencyInput;