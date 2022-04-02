import * as common from "classes/common";

import React from "react";
import InputControl from "controls/abstract/input.control";


export default class NumericInput extends InputControl {

	input_control = React.createRef ();


	static defaultProps = { 
		masked: false,
		onValidate: null
	}/* defaultProps */


	verify (event) {

		let value = event.target.value;
		let new_value = `${value.substring (0, value.selectionStart)}${event.key}${value.substring (value.selectionEnd)}`;
		
		if (event.key.length > 1) return true;
		if (isNaN (this.props.masked ? this.stripped (new_value) : new_value)) return event.preventDefault ();

	}// verify;


	componentDidMount () { if (common.isset (this.props.onValidate)) this.input_control.current.validate = this.props.onValidate }

	
	render () { 

		let properties = {...this.props};

		delete properties.masked;
		delete properties.onValidate;

		return <input type="text" ref={this.input_control} {...properties} onKeyDown={this.verify.bind (this)} /> 
		
	}// render;

}// NumericInput;