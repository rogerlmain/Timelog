import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import Permissions from "classes/storage/settings";

import { globals } from "client/classes/types/constants";

import * as common from "classes/common";


export const resize_state = { 
	false	: 0, 
	true	: 1, 
	animate	: 2
}// resize_state;


export const resize_direction = {
	both		: 0,
	horizontal	: 1,
	vertical	: 2
}// resize_direction;


export default class ResizePanel extends BaseControl {


	transitioning = false;


	outer_control = React.createRef ();
	inner_control = React.createRef ();


	null_if = (value, threshold) => { return (value == threshold ? null : value) }

	horizontal = () => { return ((this.props.direction == resize_direction.horizontal) || (this.props.direction == resize_direction.both)) }
	vertical = () => { return ((this.props.direction == resize_direction.vertical) || (this.props.direction == resize_direction.both)) }


	get_size = (control) => {
		return common.isset (control.current) ? {
			width: control.current.scrollWidth,
			height: control.current.scrollHeight
		} : null;
	}/* inner_size */;


	end_resizing () {
		this.props.parent.setState ({ resize: resize_state.false });
		this.setState ({ width: null, height: null }, () => this.transitioning = false);
	}// end_resizing;


	transition_start (event) {

		let size = this.get_size (this.inner_control);

		if (!["width", "height"].includes (event.propertyName)) return;

		if ((size.width < size.height) && event.propertyName.matches ("width")) return;
		if ((size.width >= size.height) && event.propertyName.matches ("height")) return;

		this.execute (this.props.beforeResizing ? this.props.beforeResizing.bind (this) : null);

	}//transition_start;


	transition_end (event) {

		if (!["width", "height"].includes (event.propertyName)) return;

		let outer_size = this.get_size (this.outer_control);		
		let inner_size = this.get_size (this.inner_control);

		if (common.matching_objects (inner_size, outer_size)) {
			this.execute (this.props.afterResizing ? this.props.afterResizing.bind (this) : null);
			this.end_resizing ();
		}// if;

	}// transition_end;

	
	/********/


	state = {
		width: null,
		height: null
	}// state;

	
	static defaultProps = {
		id: null,
		parent: null,

		resize: resize_state.false,
		direction: resize_direction.both,

		speed: Permissions.animation_speed (),

		stretchOnly: false
	}// defaultProps;


	constructor (props) {
		super (props);
		if (common.is_null (this.props.id)) throw "ResizePanel requires an ID";
		if (common.is_null (props.parent)) throw "ResizePanel requires a parent of type iResizable";
	}// constructor;


	componentDidMount () {
		if (this.props.beforeResizing) this.outer_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.outer_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	shouldComponentUpdate (next_props) {

		let outer_size = this.state_size ();
		let inner_size = this.get_size (this.inner_control);

		let updated = !this.same_element (this.props.children, next_props.children);

		if (updated) {
			this.setState (this.get_size (this.outer_control));
			return false;
		}// if;
	
		if (next_props.resize) {

			let new_size = {
				width: (inner_size.width > outer_size.width) ? inner_size.width : outer_size.width,
				height: (inner_size.height > outer_size.height) ? inner_size.height : outer_size.height
			}// new_size;

			if (this.transitioning) return true;
			
			if (common.matching_objects (inner_size, outer_size)) {
				this.props.parent.setState ({ resize: resize_state.false }, () => this.execute (this.props.afterResizing));
				return true;
			}// if;

			this.transitioning = true;

			if ((this.props.stretchOnly) && (!common.matching_objects (inner_size, new_size))) {
				this.props.parent.setState ({ resize: resize_state.false }, () => this.execute (this.props.afterResizing));
				return false;
			}// if;

			this.setState (inner_size);
			return false;

		}// if;

		return true;

	}// shouldComponentUpdate;


	componentDidUpdate () {
		if (this.props.resize == resize_state.true) this.end_resizing ();
	}// componentDidUpdate;


	render () {

		let outer_style = {
			margin: 0, padding: 0,
			overflow: "hidden"
		}// style;

		let inner_style = {
			margin: "none",
			padding: "none",
			display: this.props.stretchOnly ? "block" : "inline-block"
		}// inner_style;

		if (this.props.resize == resize_state.animate) {
			let speed = this.props.speed ?? globals.settings.animation_speed;
			outer_style = { ...outer_style, transition: `width ${speed}ms ease-in-out, height ${speed}ms ease-in-out` };
		}// if;


		if (this.props.stretchOnly) {
			outer_style = { ...outer_style, display: "flex" },
			inner_style = { ...inner_style, flex: "1"}
		}// if;


		if (common.isset (this.state.width) && this.horizontal ()) outer_style = { ...outer_style, width: this.state.width  };
		if (common.isset (this.state.height) && this.vertical ()) outer_style = { ...outer_style, height: this.state.height };

		return (
			<div id={`${this.props.id}_outer_control`} ref={this.outer_control} style={outer_style}>
				<div id={`${this.props.id}_inner_control`} ref={this.inner_control} style={inner_style}>
					{this.props.children}
				</div>
			</div>
		);

	}// render;


}// ResizePanel;