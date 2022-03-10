import * as common from "classes/common";

import React from "react";

import Settings from "classes/storage/settings";

import BaseControl from "controls/base.control";
import FadePanel from "controls/panels/fade.panel";

import ResizePanel, { resize_state, resize_direction } from "controls/panels/resize.panel";

import { renderToString } from "react-dom/server";


export default class ExplodingPanel extends BaseControl {


	transitioning = false;


	load_contents = (new_children) => {

		const run_animation = () => {
			if (this.state.children != new_children) return setTimeout (run_animation);
			this.forceUpdate (() => this.setState ({ resize: resize_state.animate }));
		}// run_animation;

		this.transitioning = false;

		this.setState ({ children: new_children }, run_animation);

	}// load_contents;


	/********/

	static defaultProps = {

		id: null,

		speed: Settings.animation_speed (),

		stretchOnly: false,
		direction: resize_direction.both,

		beforeShowing: null,
		beforeHiding: null,

		afterShowing: null,
		afterHiding: null

	}// ExplodingPanelProps;


	state = {

		children: null,

		resize: resize_state.false,

		animate: false,
		visible: false

	}// state;


	constructor (props) {
		super (props);
		this.state.children = this.props.children;
		this.state.visible = common.not_empty (renderToString (this.props.children));
	}// constructor;


	componentDidMount = () => this.setState ({ animate: true });


	shouldComponentUpdate (next_props, next_state) {

		let updated = !this.same_element (next_state.children, next_props.children);

		if (this.transitioning) return common.is_null (setTimeout (() => this.forceUpdate ()));

		if (updated) switch (this.state.visible) {
			case true: this.transitioning = true; this.setState ({ visible: false }); return false;
			default: this.load_contents (next_props.children); break; 
		}// if / switch;

 		return true; 

  	}// shouldComponentUpdate;


	render () {

		let target_speed = Math.floor (this.props.speed / 2);

		if (common.is_null (this.props.id)) throw "Exploding panel requires an ID";

		return (

			<FadePanel id={`${this.props.id}_exploding_panel_fade_panel`} speed={target_speed} animate={this.state.animate} visible={this.state.visible}

				beforeHiding={this.props.beforeHiding}

				afterShowing={() => {
					this.transitioning = false;
					this.execute (this.props.afterShowing)
				}}// afterShowing;

				afterHiding={() => {
					this.load_contents (this.props.children);
					this.execute (this.props.afterHiding);
				}}>


				<ResizePanel id={`${this.props.id}_exploding_panel_resize_panel`} direction={this.props.direction}
					speed={target_speed} resize={this.state.resize} parent={this} stretchOnly={this.props.stretchOnly}

					beforeResizing={() => this.execute (this.props.beforeShowing)}
					afterResizing={() => this.setState ({ visible: common.isset (this.state.children) })}>

					{this.state.children}

				</ResizePanel>
				
			</FadePanel>

		);
	}// render;


}// ExplodingPanel