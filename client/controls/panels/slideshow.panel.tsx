import * as React from "react";
import * as common from "classes/common";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import { globals } from "types/globals";


interface SlideshowPanelProps extends DefaultProps {

	id: string;

	index: number;

	speed?: number;

	beforeChanging?: Function;
	afterChanging?: Function;

	// beforeShowing?: Function;
	// afterHiding?: Function;

}// SlideshowPanelProps;


interface SlideshowPanelState extends DefaultState { index: number }


export default class SlideshowPanel extends BaseControl<SlideshowPanelProps, SlideshowPanelState> {

	public state: SlideshowPanelState = { index: 0 }


	public static defaultProps: SlideshowPanelProps = {

		id: null,
		
		index: 0,

		speed: globals.settings.animation_speed,

		beforeChanging: null,
		afterChanging: null

	}// defaultProps;


	public render () {

		if (common.is_null (this.props.id)) throw "Slideshow panel requires an ID";

		return (
			<ExplodingPanel id={`${this.props.id}_slideshow_panel`} speed={this.props.speed}
			
				beforeShowing={() => {
					if (this.props.index == 0) this.execute (this.props.beforeChanging);
				}}

				beforeHiding={this.props.beforeChanging}
				afterShowing={this.props.afterChanging}>

				{(this.props.index == 0) ? null : this.props.children [this.props.index - 1]}

			</ExplodingPanel>
		);
	}// render;

}// SlideshowPanel;