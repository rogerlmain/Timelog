import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { globals } from "types/globals";

import React from "react";
import Eyecandy from "controls/eyecandy";
import SlideshowPanel from "./slideshow.panel";


interface EyecandyPanelProps extends DefaultProps {

	eyecandyText?: string;
	eyecandySubtext?: string;

	visible?: boolean;
	static?: boolean;			//  (only relevant if visible on mount) do not animate on startup.
	eyecandyActive?: boolean;	// determines whether or not the eyecandy is showing: true = eyecandy is visible

	speed?: number;

	beforeShowingEyecandy?: Function;
	beforeShowingContents?: Function;

	afterShowingEyecandy?: Function;
	afterShowingContents?: Function;

	beforeHidingEyecandy?: Function;
	beforeHidingContents?: Function;

	afterHidingEyecandy?: Function;
	afterHidingContents?: Function;

}// EyecandyPanelProps;


export default class EyecandyPanel extends BaseControl<EyecandyPanelProps, DefaultState> {


	public static defaultProps: EyecandyPanelProps = { speed: globals.settings.animation_speed };
	
	public state: DefaultState;


	public render () {

		return (
			<SlideshowPanel id={`${this.props.id}_exploding_panel`}
				index={this.props.visible ? (this.props.eyecandyActive ? 1 : 2) : 0} pulsing={false}
				visible={true} static={this.props.static} speed={this.props.speed}

				beforeShowing={() => this.execute (this.props.eyecandyActive ? this.props.beforeShowingContents : this.props.beforeShowingEyecandy)}
				afterShowing={() => this.execute (this.props.eyecandyActive ? this.props.afterShowingEyecandy : this.props.afterShowingContents)}
				beforeHiding={() => this.execute (this.props.eyecandyActive ? this.props.beforeHidingEyecandy : this.props.beforeHidingContents)}
				afterHiding={() => this.execute (this.props.eyecandyActive ? this.props.afterHidingContents : this.props.afterHidingEyecandy)}>

				<Eyecandy text={this.props.eyecandyText} subtext={this.props.eyecandySubtext} />

				{this.return (this.props.children)}

			</SlideshowPanel>
		);

	}// render;


}// EyecandyPanel;