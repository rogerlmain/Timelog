import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import { debugging, null_value } from "client/classes/common";


export default class Container extends BaseControl {


	container = React.createRef ();


	static defaultProps = { 
		visible: true,
		inline: true,
	}// defaultProps;


	constructor (props) {
		super (props);
		let name = null_value (this.props.id) ?? this.container.current?.pathed_id;
		if (debugging (false)) console.log (`container ${name} created`);
	}// constructor;


	render () { 

		let styles = {...this.props.style};
		let properties = {...this.props};

		delete properties.style;
		delete properties.visible;
		delete properties.inline;
		delete properties.children;

		if (this.props.visible === false) styles.display = "none";
		
		return this.props.visible ? (this.props.inline ? this.props.children : <div ref={this.container} style={styles} {...properties}>{this.props.children}</div>) : null;
	
	}// render;

}// container;