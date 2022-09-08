import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";
import ResizePanel, { resize_direction } from "client/controls/panels/resize.panel";

import { empty_cell, horizontal_alignment, tracing, vertical_alignment } from "client/classes/types/constants";


export default class ExplodingPanel extends BaseControl {


	contents = null;


	fade_panel = React.createRef ();
	resize_panel = React.createRef ();


	state = {

		animating: false,
		visible: true,

		selected_index: 1,

	}// state;


	static defaultProps = {

		hAlign: horizontal_alignment.center,
		vAlign: vertical_alignment.middle,

		contents: null,
		direction: resize_direction.both,
		speed: null,

		afterChanging: null,

	}// ExplodingPanelProps;


	constructor (props) {
		super (props);
		if (tracing) console.log (`exploding panel ${this.props.id} created`);
		this.state.contents = this.props.children;
	}// constructor;


	/********/


	animate = contents => {
		if (this.state.animating) return setTimeout (() => this.animate (contents));
		this.contents = contents ?? empty_cell;
		this.setState ({ animating: true });
	}// animate;


	/********/


	shouldComponentUpdate (new_props, new_state) {

		if (this.state.animating) {
			if (!new_state.animating) setTimeout (this.forceRefresh);
			return false;
		}// if;

		if (new_state.animating) return !!this.renderState ({ visible: false });
		return true;

  	}// shouldComponentUpdate;


	render () {

		let speed = Math.floor ((this.props.speed ?? this.animation_speed ()) / 3);

		let fade_panel_id = `${this.props.id ?? `exploding_panel_${Date.now ()}`}_fade_panel`;
		let resize_panel_id = `${this.props.id ?? `exploding_panel_${Date.now ()}`}_resize_panel`;

		return <FadePanel id={fade_panel_id} key={fade_panel_id} ref={this.fade_panel} visible={this.state.visible} speed={speed}

			afterHiding={() => this.resize_panel.current.animate (this.contents)}

			afterShowing={() => {
				this.state.animating = false;
				this.execute (this.props.afterChanging);
			}}>
				
			<ResizePanel id={resize_panel_id} key={resize_panel_id} ref={this.resize_panel} stretchOnly={this.props.stretchOnly} hAlign={this.props.hAlign} vAlign={this.props.vAlign}
			
				speed={speed} alignment={this.props.alignment} direction={this.props.direction}
				afterResizing={() => this.renderState ({ visible: true })}>
					
				{this.state.contents}

			</ResizePanel>

		</FadePanel>
	
	}// render;


}// ExplodingPanel