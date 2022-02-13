import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import * as common from "classes/common";

import { globals } from "types/globals";

import React from "react";
import Eyecandy from "controls/eyecandy";
import SlideshowPanel from "./slideshow.panel";


const eyecandy_index = 1;
const contents_index = 2;


interface EyecandyPanelProps extends DefaultProps {

	id: string;

	eyecandyText?: string;
	eyecandySubtext?: string;

	eyecandyVisible?: boolean;

	static?: boolean;			//  (only relevant if visible on mount) do not animate on startup.

	speed?: number;

	afterEyecandy?: Function;

}// EyecandyPanelProps;


interface EyecandyPanelState extends DefaultState { eyecandy_ready: boolean }


export default class EyecandyPanel extends BaseControl<EyecandyPanelProps, EyecandyPanelState> {


	public static defaultProps: EyecandyPanelProps = { 
		id: null,
		speed: globals.settings.animation_speed 
	};
	
	public state: EyecandyPanelState = { eyecandy_ready: false };

	public render () {

		if (common.is_null (this.props.id)) throw ("Eyecandy requires an ID");

		let index = (/* this.state.eyecandy_ready && */this.props.eyecandyVisible) ? eyecandy_index : contents_index;

		return (
			<SlideshowPanel id={`${this.props.id}_eyecandy_panel`} index={index} speed={this.props.speed}
				afterShowing={() => this.execute ((index == eyecandy_index) ? this.props.afterEyecandy : null)}>
{/* 
				<Eyecandy text={this.props.eyecandyText} subtext={this.props.eyecandySubtext} onLoad={() => { this.setState ({ eyecandy_ready: true }); }} />
 */}

				<div style={{
					display: "flex",
					flexDirection: "row"
				}}>{}One moment...</div>

				<div>{this.props.children}</div>

			</SlideshowPanel>
		);

	}// render;


}// EyecandyPanel;