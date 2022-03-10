import React from "react";
import BaseControl from "controls/base.control";

export default class Container extends BaseControl {

	static defaultProps = { 
		condition: true,
		inline: false
	}// defaultProps;


	render () { 
		
		let properties = {...this.props};

		delete properties.style;
		delete properties.condition;
		delete properties.children;
		delete properties.inline;
			
		return this.props.condition && <div style={{ 
			display: ( this.props.inline ? null : "contents" ),
			...this.props.style 
		}} {...properties} >{this.props.children}</div> 
	
	}// render;

}// container;