import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";

import { horizontal_alignment } from "client/classes/types/constants";


export class SmallProgressMeter extends BaseControl {


	static defaultProps = { 
		visible: false,
		handler: null,
		alignment: horizontal_alignment.left,
	}/* defaultProps */

	
	render () {
		return <FadePanel {...this.filtered_properties ("alignment")} afterShowing={this.props.handler}>
			<div className="two-column-grid unselectable">
				{this.props.alignment == horizontal_alignment.left && <img className="progress-image" src="resources/images/save.indicator.gif" />}
				{this.props.children}
				{this.props.alignment == horizontal_alignment.right && <img className="progress-image" src="resources/images/save.indicator.gif" />}
			</div>
		</FadePanel>
	}// render;


}// SmallProgressMeter;