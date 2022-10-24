import React from "react";
import BaseControl from "client/controls/abstract/base.control"


export default class ExpandingInput extends BaseControl {

	
	static defaultProps = { 
		stretchOnly: false,
		readOnly: false,
		value: null,
	}/* defaultProps */;


	/********/


	input = React.createRef ();


	/********/


	text_size = () => this.input.current.textWidth () + this.input.current.outsideWidth ();

	
	resize = () => {

		let input = this.input.current;
		let size = this.text_size ();

		if (size > input.clientWidth) return input.style.width = `${size}px`;
		if (this.props.stretchOnly) return; 
			
		input.style.width = `${size}px`;

	}// resize;

	
	/********/


	componentDidMount = () => this.input.current.style.width = `${this.text_size ()}px`;
	componentDidUpdate = this.resize;


	render () {

		let properties = {...this.props};
		let value = this.props.value;

		delete properties.stretchOnly;
		delete properties.type;
		delete properties.value;

		if (!this.props.readOnly) {
			properties ["onChange"] = this.resize;
			properties ["defaultValue"] = value;
		} else {
			properties ["value"] = value;
		}// if;

		return <input ref={this.input} readOnly={this.props.readOnly} onFocus={this.resize} {...properties} />

	}// render;

}// ExpandingInput;