import BaseControl from "client/controls/base.control";

import React from "react";
import SlideshowPanel from "./slideshow.panel";
import Permissions from "classes/storage/settings";

import * as common from "classes/common";


const eyecandy_index = 1;
const contents_index = 2;


export default class EyecandyPanel extends BaseControl {


	static defaultProps = { 
		id: null,
		speed: Permissions.animation_speed (),
		stretchOnly: false
	};
	

	state = { eyecandy_image_name: "resources/images/data.indicator.gif" };


	render () {

		if (common.is_null (this.props.id)) throw ("Eyecandy requires an ID");

		let eyecandy_style = {
			display: "flex",
			flexDirection: "row", 
			...this.props.eyecandyStyle
		}// eyecandy_style;

		let index = (this.props.eyecandyVisible) ? eyecandy_index : contents_index;
		let id = `${this.props.id}_eyecandy_panel`;

		return (
			<SlideshowPanel id={id} index={index} speed={this.props.speed} stretchOnly={this.props.stretchOnly}

				beforeChanging={() => this.execute (this.props.beforeChanging)}

				afterChanging={() => {
					this.execute ((index == eyecandy_index) ? this.props.onEyecandy : null);
					this.execute (this.props.afterChanging);
				}}>

				<div style={eyecandy_style}>
					<img src={this.state.eyecandy_image_name} style={{ marginRight: "0.5em" }} />
					{this.props.eyecandyText}
				</div>

				<div id={`${id}_container`}>{this.props.children}</div>

			</SlideshowPanel>
		);

	}// render;


}// EyecandyPanel;