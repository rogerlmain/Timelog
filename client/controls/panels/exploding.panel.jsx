import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";
import ResizePanel, { resize_direction } from "client/controls/panels/resize.panel";

import { horizontal_alignment, tracing, vertical_alignment } from "client/classes/types/constants";
import { not_set } from "client/classes/common";


export default class ExplodingPanel extends BaseControl {


	fade_panel = React.createRef ();
	resize_panel = React.createRef ();


	state = {

		animating: false,
		visible: true,

		model: null,
		handler: null,

		selected_index: 1,

	}// state;


	static defaultProps = {

		hAlign: horizontal_alignment.center,
		vAlign: vertical_alignment.middle,

		direction: resize_direction.both,
		speed: null,

		afterChanging: null,

	}// ExplodingPanelProps;


	constructor (props) {
		super (props);
		if (not_set (props.id)) throw "ExplodingPanel requires and ID";
		if (tracing) console.log (`exploding panel ${this.props.id} created`);
	}// constructor;


	/********/


	animate = new_handler => this.setState ({ 
		visible: false,
		handler: new_handler,
	});
		

	/********/


	render () {

		let speed = Math.floor ((this.props.speed ?? this.animation_speed ()) / 3);

		let fade_panel_id = `${this.props.id ?? `exploding_panel_${Date.now ()}`}_fade_panel`;
		let resize_panel_id = `${this.props.id ?? `exploding_panel_${Date.now ()}`}_resize_panel`;

		return <FadePanel id={fade_panel_id} key={fade_panel_id} ref={this.fade_panel} visible={this.state.visible} speed={speed}

			afterHiding={() => this.resize_panel.current.freeze (() => this.execute (this.state.handler).then (() => setTimeout (this.resize_panel.current.animate)))}
			afterShowing={()=> this.execute (this.props.afterChanging)}>

			<ResizePanel id={resize_panel_id} key={resize_panel_id} ref={this.resize_panel} stretchOnly={this.props.stretchOnly} hAlign={this.props.hAlign} vAlign={this.props.vAlign}
			
				speed={speed} alignment={this.props.alignment} direction={this.props.direction}
				afterResizing={() => this.setState ({ visible: true })}>

				{this.props.children}				

			</ResizePanel>

		</FadePanel>

	}// render;


}// ExplodingPanel