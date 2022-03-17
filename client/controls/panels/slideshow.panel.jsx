import * as React from "react";
import * as common from "classes/common";

import BaseControl from "client/controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import Permissions from "classes/storage/settings";


export default class SlideshowPanel extends BaseControl {

	state = { index: 0 }


	static defaultProps = {

		id: null,
		
		index: 0,

		speed: Permissions.animation_speed (),

		stretchOnly: false,

		beforeChanging: null,
		afterChanging: null

	}// defaultProps;


	constructor (props) {
		super (props);
		this.validate_ids (props);
	}// constructor;


	render () {

		return (
			<ExplodingPanel id={`${this.props.id}_slideshow_panel`} speed={this.props.speed} stretchOnly={this.props.stretchOnly}
			
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