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

	eyecandyVisible?: boolean;

	speed?: number;

	afterEyecandy?: Function;

}// EyecandyPanelProps;


interface EyecandyPanelState extends DefaultState { eyecandy_image_name: string }


export default class EyecandyPanel extends BaseControl<EyecandyPanelProps, EyecandyPanelState> {


	public static defaultProps: EyecandyPanelProps = { 
		id: null,
		speed: globals.settings.animation_speed 
	};
	
	public state: EyecandyPanelState = { eyecandy_image_name: "resources/images/data.indicator.gif" };

	public render () {

		if (common.is_null (this.props.id)) throw ("Eyecandy requires an ID");

		let index = (this.props.eyecandyVisible) ? eyecandy_index : contents_index;
		let id = `${this.props.id}_eyecandy_panel`;

		return (
			<SlideshowPanel id={id} index={index} speed={this.props.speed}
				afterShowing={() => this.execute ((index == eyecandy_index) ? this.props.afterEyecandy : null)}>

				<div style={{
					display: "flex",
					flexDirection: "row",
					gap: "1em"
				}}>
					<img src={this.state.eyecandy_image_name} />
					{this.props.eyecandyText}
				</div>

				<div id={`${id}_container`}>{this.props.children}</div>

			</SlideshowPanel>
		);

	}// render;


}// EyecandyPanel;