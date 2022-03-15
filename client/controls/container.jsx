import React from "react";
import BaseControl from "controls/base.control";


export default class Container extends BaseControl {

	static defaultProps = { 
		condition: true,
		contentsOnly: false,
		inline: false
	}// defaultProps;


	render () { 
		
		let properties = {...this.props};

		delete properties.style;

		delete properties.condition;
		delete properties.contentsOnly;
		delete properties.inline;
			
		delete properties.children;
		
		return this.props.contentsOnly ? this.props.children : <div style={{ 
			display: ( this.props.inline ? null : "contents" ),
			...this.props.style 
		}} {...properties}>{this.props.children}</div>;
	
	}// render;

}// container;