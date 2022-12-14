import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import { is_null } from "client/classes/common";


// Companion piece to ToggleSwitch - requires a ToggleSwitch to be meaningful


export default class ToggleButton extends BaseControl {


	static defaultProps = { 
		className: null,
		htmlFor: null 
	}// defaultProps;


	constructor (props) {
		super (props);
		if (is_null (props.htmlFor)) throw "ToggleButton is missing the htmlFor property";
	}// constructor;


	render () {
		return <div className={this.props.className} 
			onClick={() => document.getElementById (this.props.htmlFor).click ()} 
			style={{ cursor: "pointer" }}>

			{this.props.children}

		</div>
	}// render;

}// ToggleButton;