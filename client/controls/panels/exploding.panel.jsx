import React from "react";

import Settings from "classes/storage/settings";

import BaseControl from "controls/abstract/base.control";
import FadePanel from "controls/panels/fade.panel";

import ResizePanel, { resize_state, resize_direction } from "controls/panels/resize.panel";

import { renderToString } from "react-dom/server";
import { isset, is_null, not_empty, nested_value } from "classes/common";


export default class ExplodingPanel extends BaseControl {


	transitioning = false;


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
		this.validate_ids (props);
		this.state.children = this.props.children;
		this.state.visible = not_empty (renderToString (this.props.children));
	}// constructor;


	load_contents = (new_children) => {

		const run_animation = () => {
			if (this.state.children != new_children) return setTimeout (run_animation);
			this.forceUpdate (() => this.setState ({ resize: resize_state.animate }));
		}// run_animation;

		this.transitioning = false;

		this.setState ({ children: new_children }, run_animation);

	}// load_contents;


	componentDidMount = () => this.setState ({ animate: true });


	shouldComponentUpdate (next_props, next_state) {

		let updated = !this.same_element (next_state.children, next_props.children, false);
		let changed = !this.same_element (next_state.children, next_props.children, true);

		if (this.transitioning) return is_null (setTimeout (() => this.forceUpdate ()));

		if (updated) {
			if (this.state.visible) {
				this.transitioning = true; 
				this.setState ({ visible: false }); 
				return false;
			} else {
				if (changed) {
					this.load_contents (next_props.children); 
					return false;
				}// if;
			}// if;
		} else {
			if (changed) {
				this.load_contents (next_props.children); 
				return false;
			}// if;
		}// if;

 		return true; 

  	}// shouldComponentUpdate;


	render () {

		let target_speed = Math.floor (this.props.speed / 2);

		let has_width = ((this.props.direction == resize_direction.vertical) && (isset (nested_value (this.props.style, "width"))));
		let has_height = ((this.props.direction == resize_direction.horizontal) && (isset (nested_value (this.props.style, "height"))));

		let panel_style = has_width ? { width: this.props.style.width } : (has_height ? { height: this.props.style.height } : null);

		return (

			<FadePanel id={`${this.props.id}_exploding_panel_fade_panel`} speed={target_speed} animate={this.state.animate} 
				visible={this.state.visible} style={panel_style}

				beforeHiding={this.props.beforeHiding}

				afterShowing={() => {
					this.transitioning = false;
					this.execute (this.props.afterShowing)
				}}// afterShowing;

				afterHiding={() => {
					this.load_contents (this.props.children);
					this.execute (this.props.afterHiding);
				}}>


				<ResizePanel id={`${this.props.id}_exploding_panel_resize_panel`} direction={this.props.direction} style={panel_style}
					speed={target_speed} resize={this.state.resize} parent={this} stretchOnly={this.props.stretchOnly}

					beforeResizing={() => this.execute (this.props.beforeShowing)}
					afterResizing={() => this.setState ({ visible: isset (this.state.children) })}>

					{this.transitioning ? this.state.children : this.props.children}

				</ResizePanel>
				
			</FadePanel>

		);
	}// render;


}// ExplodingPanel