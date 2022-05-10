import React from "react";

import InputControl from "controls/abstract/input.control";
import Container from "controls/container";

import { blank } from "classes/types/constants";
import { is_number } from "classes/common";


export default class AlphaCapitalInput extends InputControl {


	process_keystroke = event => {

		let numeric = event.code.matches (/^Digit.+?/);
		let index = event.target.selectionStart;

		if (event.key.equals ("Delete") && (index == 0) && (is_number (event.target.value [1]))) return event.preventDefault ();
		if (event.key.equals ("Backspace") && (index == 1) && (is_number (event.target.value [1]))) return event.preventDefault ();

		if (event.key.length > 1) return true; 

		if ((!(numeric || event.code.matches (/^Key.+?/))) || (numeric && (index == 0))) event.preventDefault ();

	}// process_keystroke;


	/********/


	render () { 

		let styles = {
			...this.props.style,
			textTransform: "uppercase"
		}/* styles */;

		return <Container key={this.props.defaultValue}>
			<input type="text" onKeyDown={this.process_keystroke} style={styles} 
				defaultValue={this.props.value ?? this.props.defaultValue ?? blank}
				{...this.filtered_properties ("type", "style", "value", "defaultValue")}>
			</input>
		</Container>

	}// render;

	
}// AlphaCapitalInput;