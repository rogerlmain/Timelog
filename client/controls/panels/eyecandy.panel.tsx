import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import * as common from "classes/common";

import { globals } from "types/globals";

import React from "react";
import SlideshowPanel from "./slideshow.panel";


const eyecandy_index = 1;
const contents_index = 2;


interface EyecandyPanelProps extends DefaultProps {

	id: string;

	eyecandyText?: string;
	eyecandySubtext?: string;

	eyecandyStyle?: Object;

	eyecandyVisible?: boolean;
	stretchOnly?: boolean;

	speed?: number;

	beforeChanging?: Function;
	afterChanging?: Function;

	onEyecandy?: Function;

}// EyecandyPanelProps;


interface EyecandyPanelState extends DefaultState { eyecandy_image_name: string }


export default class EyecandyPanel extends BaseControl<EyecandyPanelProps, EyecandyPanelState> {


	public static defaultProps: EyecandyPanelProps = { 
		id: null,
		speed: globals.settings.animation_speed,
		stretchOnly: false
	};
	

	public state: EyecandyPanelState = { eyecandy_image_name: "resources/images/data.indicator.gif" };


	public render () {

		if (common.is_null (this.props.id)) throw ("Eyecandy requires an ID");

		let eyecandy_style: Object = {
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
					<img src={this.state.eyecandy_image_name} />
					{this.props.eyecandyText}
				</div>

				<div id={`${id}_container`}>{this.props.children}</div>

			</SlideshowPanel>
		);

	}// render;


}// EyecandyPanel;