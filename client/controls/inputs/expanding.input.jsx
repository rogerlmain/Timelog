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


	shouldComponentUpdate = new_props => {
		if (this.props.readOnly && (new_props.value != this.props.value)) this.execute (this.props.onChange, new_props.value);
		return true;
	}// shouldComponentUpdate;


	componentDidMount = () => this.input.current.style.width = `${this.text_size ()}px`;
	componentDidUpdate = this.resize;


	render () {

		let props = {...this.props};
		let value = this.props.value;
		let control_id = `${this.props.id}_expando`;

		delete props.stretchOnly;
		delete props.id;
		delete props.type;
		delete props.value;

		if (!this.props.readOnly) {
			props.onChange = event => this.execute (this.props.onChange, event).then (this.resize);
			props.defaultValue = value;
		} else {
			props.value = value;
		}// if;

		return <input id={control_id} ref={this.input} readOnly={this.props.readOnly} onFocus={this.resize} key={control_id} name={control_id} {...props} />

	}// render;

}// ExpandingInput;