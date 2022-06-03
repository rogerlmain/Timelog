import React from "react";
import BaseControl from "../abstract/base.control";

import { not_set } from "client/classes/common";

import "client/resources/styles/controls.css";


export default class CurrencyInput extends BaseControl {


	static defaultProps = { 
		id: null,
		className: null,
		defaultValue: null,
		maxLength: -1,
	}// default_props;


	constructor (props) {
		super (props);
		if (not_set (props.id)) throw "CurrencyInput requires an ID";
	}// constructor;


	process_keystroke = event => {
		if (event.key == ".") return event.preventDefault ();
		if ((event.key.length == 1) && (event.target.value.length == this.props.maxLength)) return event.preventDefault ();
	}// process_keystroke;


	render = () => {

		let properties = {...this.props};

		delete properties.id;
		delete properties.min;
		delete properties.name;
		delete properties.step;
		delete properties.type;
		delete properties.defaultValue;

		return <div className="currency-input">
			<div>$</div>
			<input type="number" id={this.props.id} name={this.props.id}
				min={0} step={1} defaultValue={this.props.defaultValue}
				onKeyDown={this.process_keystroke} {...properties}>
			</input>
		</div>
	}// render;

}// CurrencyInput;