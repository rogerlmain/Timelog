import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ExplodingPanel from "client/controls/panels/exploding.panel";

import { eyecandy_images, horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { is_null } from "client/classes/common";


export const eyecandy_sizes = {
	small	: "small",
	medium	: "medium"
}// eyecandy_sizes;


export default class EyecandyPanel extends BaseControl {


	exploding_panel = React.createRef ();


	state = { eyecandy_visible: false }


	static defaultProps = { 

		id: null,

		speed: null,
		stretchOnly: false,

		text: null,

		hAlign: horizontal_alignment.center,
		vAlign: vertical_alignment.middle,

		eyecandySize: eyecandy_sizes.small,
		eyecandyVisible: false,

		onEyecandy: null,
		onContents: null,

	}// defaultProps;


	constructor (props) {
		super (props);
		this.state.eyecandy_visible = props.eyecandyVisible;
	}// constructor;


	/********/


	eyecandy = () => <div id={`${this.props.id}_eyecandy`} style={this.eyecandy_style ()}>
		<img src={eyecandy_images [this.props.eyecandySize]} style={{ marginRight: "0.5em", alignSelf: "center" }} />
		{this.props.text}
	</div>


	contents = () => {
		
		let container_style = { display: (this.state.eyecandy_visible ? "none" : "inline-flex") }

		if (this.props.stretchOnly) container_style = {
			...container_style,
			width: "100%",
			height: "100%",
		}// if;

		return <div id={`${this.props.id}_container`} style={container_style}>{this.props.children}</div>

	}/* contents */;
	

	eyecandy_style = () => { return {
		display: "inline-flex",
		flexDirection: "row", 
		alignItems: "center",
		...this.props.eyecandyStyle,
	}}/* eyecandy_style */;


	/********/


	shouldComponentUpdate (new_props) {
		if (this.props.eyecandyVisible != new_props.eyecandyVisible) return !!this.exploding_panel.current.animate (() => this.setState ({ eyecandy_visible: new_props.eyecandyVisible }));
		return true;
	}// shouldComponentUpdate;


	render () {

		if (is_null (this.props.id)) throw ("Eyecandy requires an ID");

		this.rendered = true;

		return <ExplodingPanel id={`${this.props.id}_exploding_panel`} ref={this.exploding_panel} speed={this.animation_speed ()} 

			hAlign={this.props.hAlign} vAlign={this.props.vAlign} stretchOnly={this.props.stretchOnly}
			afterChanging={() => { if (this.state.eyecandy_visible) this.execute (this.props.onEyecandy, this) }}>

			{this.state.eyecandy_visible ? this.eyecandy () : this.contents ()}
			
		</ExplodingPanel>

	}// render;


}// EyecandyPanel;