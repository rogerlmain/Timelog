import React from "react";
import BaseControl from "client/controls/base.control";
import FadePanel from "./panels/fade.panel";


export const LeftHand = "left";
export const RightHand = "right";


export class SmallProgressMeter extends BaseControl {


	static defaultProps = { 
		visible: false,
		alignment: LeftHand
	}/* defaultProps */

	
	render () {
		return (
			<FadePanel id="progress_meter" visible={this.props.visible}>
				<div className="two-column-grid unselectable">
					{this.props.alignment == LeftHand && <img className="progress-image" src="client/resources/images/save.indicator.gif" />}
					{this.props.children}
					{this.props.alignment == RightHand && <img className="progress-image" src="client/resources/images/save.indicator.gif" />}
				</div>
			</FadePanel>
		);
	}// render;

}// SmallProgressMeter;