import React from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import FadePanel from "./panels/fade.panel";


export const LeftHand: String = "left";
export const RightHand: String = "right";

export type HandSide = typeof LeftHand | typeof RightHand;


interface ProgressMeterProps extends DefaultProps {
	visible: boolean;
	alignment?: HandSide;
}// ProgressMeterProps;


export class SmallProgressMeter extends BaseControl<ProgressMeterProps, DefaultState> {


	public static defaultProps: ProgressMeterProps = { 
		visible: false,
		alignment: LeftHand
	}/* defaultProps */

	
	render () {
		return (
			<FadePanel id="progress_meter" visible={this.props.visible}>
				<div className="two-column-grid">
					{this.props.alignment == LeftHand && <img className="progress-image" src="resources/images/save.indicator.gif" />}
					{this.props.children}
					{this.props.alignment == RightHand && <img className="progress-image" src="resources/images/save.indicator.gif" />}
				</div>
			</FadePanel>
		);
	}// render;

}// SmallProgressMeter;