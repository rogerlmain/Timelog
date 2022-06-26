import React from "react";

import BaseControl from "controls/abstract/base.control";
import SlideshowPanel from "controls/panels/slideshow.panel";

import { eyecandy_images } from "classes/types/constants";
import { is_null, nested_value } from "classes/common";


const eyecandy_index = 1;
const contents_index = 2;


export const eyecandy_sizes = {
	small	: "small",
	medium	: "medium"
}// eyecandy_sizes;


export default class EyecandyPanel extends BaseControl {


	item_container = React.createRef ();
	slideshow_panel = React.createRef ();


	static defaultProps = { 

		id: null,

		speed: null,
		stretchOnly: false,

		text: null,

		eyecandySize: eyecandy_sizes.small,
		eyecandyVisible: false,

		onEyecandy: null,
		onContents: null,

	}// defaultProps;


	/********/


	forceResize = () => this.slideshow_panel.current.forceResize ();


	/********/


	render () {

		if (is_null (this.props.id)) throw ("Eyecandy requires an ID");

		let eyecandy_style = {
			display: "flex",
			flexDirection: "row", 
			minHeight: nested_value (this, "item_container", "current", "offsetHeight"),
			alignItems: "center",
			...this.props.eyecandyStyle
		}// eyecandy_style;

		let index = (this.props.eyecandyVisible) ? eyecandy_index : contents_index;
		let id = `${this.props.id}_eyecandy_panel`;

		return <SlideshowPanel id={id} ref={this.slideshow_panel} index={index} speed={this.animation_speed ()} stretchOnly={this.props.stretchOnly}

			beforeChanging={() => this.execute (this.props.beforeChanging)}

			afterChanging={() => {
				this.execute ((index == eyecandy_index) ? this.props.onEyecandy : this.props.onContents);
				this.execute (this.props.afterChanging);
			}}>

			<div id={`${id}_eyecandy`} style={eyecandy_style}>
				<img src={eyecandy_images [this.props.eyecandySize]} style={{ marginRight: "0.5em", alignSelf: "center" }} />
				{this.props.text}
			</div>

			<div id={`${id}_container`} ref={this.item_container}>{this.props.children}</div>

		</SlideshowPanel>

	}// render;


}// EyecandyPanel;