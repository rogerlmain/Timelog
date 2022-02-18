import * as React from "react";
import * as common from "classes/common";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import { globals } from "types/globals";


interface SlideshowPanelProps extends DefaultProps {

	id: string;

	index: number;

	speed?: number;

	beforeShowing?: Function;
	afterShowing?: Function;

	beforeHiding?: Function;
	afterHiding?: Function;
}// SlideshowPanelProps;


export default class SlideshowPanel extends BaseControl<SlideshowPanelProps, DefaultState> {


	public static defaultProps: SlideshowPanelProps = {

		id: null,
		
		index: 0,

		speed: globals.settings.animation_speed,

		beforeShowing: null,
		afterShowing: null,

		beforeHiding: null,
		afterHiding: null

	}// defaultProps;


	public render () {

		if (common.is_null (this.props.id)) throw "Slideshow panel requires an ID";

		return (
			<ExplodingPanel id={`${this.props.id}_slideshow_panel`} speed={this.props.speed}
			
				beforeShowing={this.props.beforeShowing}
				afterShowing={this.props.afterShowing}

				beforeHiding={this.props.beforeHiding}
				afterHiding={() => this.setState ({ active_index: this.props.index }, () => this.execute (this.props.afterHiding))}>

				{(this.props.index == 0) ? null : this.props.children [this.props.index - 1]}

			</ExplodingPanel>
		);
	}// render;

}// SlideshowPanel;