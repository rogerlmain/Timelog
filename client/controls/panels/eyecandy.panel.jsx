import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import Settings from "classes/storage/settings";

import BaseControl from "controls/abstract/base.control";
import SlideshowPanel from "controls/panels/slideshow.panel";


const eyecandy_index = 1;
const contents_index = 2;


export const eyecandy_sizes = {
	small	: "small",
	medium	: "medium"
}// eyecandy_sizes;


export default class EyecandyPanel extends BaseControl {


	static defaultProps = { 
		id: null,
		speed: Settings.animation_speed (),
		stretchOnly: false,

		text: null,

		eyecandySize: eyecandy_sizes.small,
		eyecandyVisible: true,
	};


	/********/


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

				<div id={`${id}_eyecandy`} style={eyecandy_style}>
					<img src={constants.eyecandy_images [this.props.eyecandySize]} style={{ marginRight: "0.5em", alignSelf: "center" }} />
					{this.props.text}
				</div>

				<div id={`${id}_container`}>{this.props.children}</div>

			</SlideshowPanel>
		);

	}// render;


}// EyecandyPanel;