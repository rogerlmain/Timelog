import * as common from "classes/common";

import React from "react";
import InputControl from "controls/abstract/input.control";


export default class NumericInput extends InputControl {

	input_control = React.createRef ();


	static defaultProps = { onKeyDown: null }


	key_handler (event) {

		if ((event.key.length > 1) || ((parseInt (event.key) > -1) && (parseInt (event.key) < 10))) return this.execute (this.props.onKeyDown, event);
		if ((event.key == ".") && (event.target.value.indexOf (".") < 0)) return this.execute (this.props.onKeyDown, event);

	//	event.preventDefault ();

	}// key_handler;


	render () { 
		return <input type="text" ref={this.input_control} {...this.props} onKeyDown={this.key_handler.bind (this)} /> 
	}// render;

}// NumericInput;