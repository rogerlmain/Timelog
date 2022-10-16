import React from "react";
import BaseControl from "../abstract/base.control";

import { isset, not_set } from "client/classes/common";

import "resources/styles/controls.css";


export default class CurrencyInput extends BaseControl {


	static defaultProps = { 
		id: null,
		className: null,
		defaultValue: null,

		onBlur: null,
		onChange: null,

		maxLength: -1,
	}// default_props;


	constructor (props) {
		super (props);
		if (not_set (props.id)) throw "CurrencyInput requires an ID";
	}// constructor;


	/********/


	currency_input = React.createRef ();
	state = { current_value: 0 }


	/********/


	text_length = () => (this.state.current_value.toCurrency (null).length + 1);


	process_keystroke = event => {

		const keycode = event.which ?? event.keyCode;

		let new_value = null;

		if (["backspace", "delete"].includes (event.key.toLowerCase ())) new_value = Math.floor (this.state.current_value / 10);
		if (isFinite (event.key)) new_value = (this.state.current_value * 10) + parseInt (event.key);

		if ((keycode > 32) || (keycode == 8)) event.preventDefault ();
		if (isset (this.props.maxLength) && (new_value.length > this.props.maxLength)) return !!event.preventDefault ();

		this.setState ({ current_value: new_value }, () => { event.target.size = Math.max (this.currency_input.current.size, this.text_length ()) });

	}// process_keystroke;

	
	/********/


	shouldComponentUpdate (new_props) {
		if (new_props.defaultValue != this.props.defaultValue) return !!this.setState ({ current_value: new_props.defaultValue });
		return true;
	}// shouldComponentUpdate;


	componentDidMount () { 
		this.setState ({ current_value: this.props.defaultValue }, () => this.currency_input.current.size = this.text_length ());
	}// componentDidMount;


	render = () => {

		let properties = {...this.props};
		let input_handler = isset (this.props.onInput) ? (event => this.execute (this.props.onInput)) : null;

		if (isset (properties.onKeyDown)) throw "Cannot set onKeyDown property for CurrencyInput.";

		delete properties.min;
		delete properties.name;
		delete properties.step;
		delete properties.type;
		delete properties.defaultValue;

		return <div className="currency-input">
			<div>$</div>
			<input type="text" name={this.props.id} ref={this.currency_input}
				value={this.state.current_value.toCurrency (null)} min={0} step={1} 
				onInput={input_handler} onKeyDown={this.process_keystroke} {...properties}>
			</input>
		</div>
	}// render;

}// CurrencyInput;