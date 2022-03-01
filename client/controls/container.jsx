import React from "react";
import BaseControl from "controls/base.control";

export default class Container extends BaseControl {

	static defaultProps = { condition: true }


	render () { 
		
		let properties = {...this.props};

		delete properties.style;
		delete properties.condition;
		delete properties.children;
			
		return this.props.condition && <div style={{ ...this.props.style, display: "contents" }} {...properties}>{this.props.children}</div> 
	
	}// render;

}// container;