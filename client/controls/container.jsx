import React from "react";
import BaseControl from "controls/abstract/base.control";

import { tracing, debugging } from "client/classes/types/constants";
import { nested_value, null_value } from "client/classes/common";


export default class Container extends BaseControl {


	container = React.createRef ();


	static defaultProps = { 
		visible: true,
		inline: false
	}// defaultProps;


	constructor (props) {
		super (props);
		let name = null_value (this.props.id) ?? nested_value (this.container.current, "pathed_id");
		if (tracing) console.log (`container ${name} created`);
	}// constructor;


	render () { 

		let styles = {...this.props.style}
		let properties = {...this.props};

		delete properties.style;

		delete properties.visible;
		delete properties.inline;
			
		delete properties.children;

		if (this.props.inline === false) styles.display = "contents";
		if (this.props.visible === false) styles.display = "none";
		
		return this.props.visible ? (this.props.inline ? this.props.children : <div ref={this.container} style={styles} {...properties}>{this.props.children}</div>) : null;
	
	}// render;

}// container;