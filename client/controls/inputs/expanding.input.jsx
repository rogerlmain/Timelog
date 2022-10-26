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

		return <input {...props} id={this.props.id} name={this.props.id} key={`${this.props.id}_expando`} ref={this.input} onFocus={this.resize} />

	}// render;

}// ExpandingInput;