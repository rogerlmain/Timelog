import React from "react";

import SettingStorage from "classes/storage/setting.storage";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";

import ResizePanel, { resize_state, resize_direction } from "client/controls/panels/resize.panel";

import { isset, is_array, is_null, nested_value, not_array } from "client/classes/common";


export default class ExplodingPanel extends BaseControl {


	transitioning = false;


	static defaultProps = {

		id: null,

		speed: SettingStorage.animation_speed (),

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
		visible: true,

	}// state;


	constructor (props) {
		super (props);
		this.validate_ids (props);
		this.validate_children (props.children);
	}// constructor;


	load_contents = (new_children) => {

		const run_animation = () => {
			if (this.state.children != new_children) return setTimeout (run_animation);
			this.forceUpdate (() => this.setState ({ resize: resize_state.animate }));
		}// run_animation;

		this.transitioning = false;

		this.setState ({ children: new_children }, run_animation);

	}// load_contents;


	validate_children = children => {
		if (not_array (children)) children = [children];
		for (let child of children) {
			if (nested_value (child.type, "name") != "Container") throw `Exploding panel can only contain Container objects: ${child.constructor.name} found (id: ${this.props.id})`;
		}// for;
		this.state.children = this.props.children;
	}/* validate_children */;


	/********/


	componentDidMount () { this.setState ({ animate: true }) }


	shouldComponentUpdate (next_props) {

		let updated = false;
		let current_children = this.children (this.props);
		let next_children = this.children (next_props);

		for (let next_child of next_children) {
			let current_child = current_children.find (child => child.props.id == next_child.props.id);
			if (current_child.props.visible != next_child.props.visible) {
				updated = true;
				break;
			}// if;
		}// for;

		if (this.transitioning) return is_null (setTimeout (() => this.forceUpdate ()));

		if ((updated) && (this.state.visible)) {
			this.transitioning = true; 
			this.setState ({ visible: false }); 
			return false;
		}// if;

 		return true; 

  	}// shouldComponentUpdate;


	render () {

		let target_speed = Math.floor (this.props.speed / 2);

		let has_width = ((this.props.direction == resize_direction.vertical) && (isset (nested_value (this.props.style, "width"))));
		let has_height = ((this.props.direction == resize_direction.horizontal) && (isset (nested_value (this.props.style, "height"))));

		let panel_style = has_width ? { width: this.props.style.width } : (has_height ? { height: this.props.style.height } : null);

		return <FadePanel id={`${this.props.id}_exploding_panel_fade_panel`} speed={target_speed} animate={this.state.animate} 
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

	}// render;


}// ExplodingPanel