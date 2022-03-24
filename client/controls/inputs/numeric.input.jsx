import React from "react";
import InputControl from "controls/abstract/input.control";


export default class NumericInput extends InputControl {

	static defaultProps = { masked: false }


	verify (event) {

		let value = event.target.value;
		let new_value = `${value.substring (0, value.selectionStart)}${event.key}${value.substring (value.selectionEnd)}`;
		
		if (event.key.length > 1) return true;
		if (isNaN (this.props.masked ? this.stripped (new_value) : new_value)) return event.preventDefault ();

	}// verify;

	
	render () { 
		let properties = {...this.props};
		delete properties.masked;
		return <input {...properties} type="text" onKeyDown={this.verify.bind (this)} /> 
	}// render;

}// NumericInput;