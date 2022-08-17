import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import { isset, is_null, matching_objects, nested_value } from "classes/common";
import { tracing } from "client/classes/types/constants";


export const resize_state = { 
	false	: 0, 
	true	: 1, 
	animate	: 2,
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


	state = {
		width: null,
		height: null
	}// state;

	
	static defaultProps = {
		id: null,
		parent: null,

		resize: resize_state.false,
		direction: resize_direction.both,

		speed: null,

		stretchOnly: false,
		static: true,
	}// defaultProps;


	constructor (props) {

		super (props);
		
		if (is_null (this.props.id)) throw "ResizePanel requires an ID";
		if (is_null (props.parent)) throw "ResizePanel requires a parent";

		if (tracing) console.log (`resize_panel '${this.props.id}' created`);

	}// constructor;


	null_if = (value, threshold) => { return (value == threshold ? null : value) }

	horizontal = () => { return ((this.props.direction == resize_direction.horizontal) || (this.props.direction == resize_direction.both)) }
	vertical = () => { return ((this.props.direction == resize_direction.vertical) || (this.props.direction == resize_direction.both)) }


	end_resizing = () => {
		this.props.parent.setState ({ resize: resize_state.false });
		this.setState ({ width: null, height: null }, () => {
			this.transitioning = false;
			this.execute (this.props.afterResizing);
		});
	}// end_resizing;


	transition_start = (event) => {

		let size = this.get_size (this.inner_control);

		if (!["width", "height"].includes (event.propertyName)) return;

		if ((size.width < size.height) && event.propertyName.equals ("width")) return;
		if ((size.width >= size.height) && event.propertyName.equals ("height")) return;

		this.execute (this.props.beforeResizing ? this.props.beforeResizing.bind (this) : null);

	}//transition_start;


	transition_end = (event) => {

		if (!["width", "height"].includes (event.propertyName)) return;

		let outer_size = this.get_size (this.outer_control);		
		let inner_size = this.get_size (this.inner_control);

		if (matching_objects (inner_size, outer_size)) this.end_resizing ();

	}// transition_end;

	
	control_size (control = this) {
		return (is_null (control)) ? null : {
			width: control?.state.width,
			height: control?.state.height
		}// return;
	}// control_size;

	get_size = (control) => {
		return isset (control.current) ? {
			width: control.current.scrollWidth,
			height: control.current.scrollHeight
		} : null;
	}/* inner_size */;


	/********/


	componentDidMount () {
		if (this.props.beforeResizing) this.outer_control.current.addEventListener ("transitionstart", this.transition_start);
		this.outer_control.current.addEventListener ("transitionend", this.transition_end);
	}// componentDidMount;


	shouldComponentUpdate (new_props) {

		const outer_size = {
			width: this.state.width,
			height: this.state.height,
		}// outer_size;

		const inner_size = {
			width: this.inner_control?.current.scrollWidth,
			height: this.inner_control?.current.scrollHeight,
		}// inner_size;
		
		
		const unsizable = (new_size) => {

			if (matching_objects (inner_size, outer_size)) return true;

			if (this.props.stretchOnly) {
				if (inner_size.width > new_size.width) return true;
				if (inner_size.height > new_size.height) return true;
			}// if;

		}/* unsizable */;


		if (this.different_element (this.props.children, new_props.children)) {
			this.setState (this.get_size (this.outer_control));
			return false;
		}// if;
	
		if (new_props.resize) {

			let new_size = {
				width: (inner_size.width > outer_size.width) ? inner_size.width : outer_size.width,
				height: (inner_size.height > outer_size.height) ? inner_size.height : outer_size.height
			}// new_size;

			if (this.transitioning) return true;
			
			if (unsizable (new_size)) {
				this.props.parent.setState ({ resize: resize_state.false }, this.end_resizing);
				return true;
			}// if;

			this.transitioning = true;

			this.setState (inner_size);
			return false;

		}// if;

		return true;

	}// shouldComponentUpdate;


	componentDidUpdate () {
		if (this.props.resize == resize_state.true) this.end_resizing ();
	}// componentDidUpdate;


	render () {

		let speed = this.animation_speed ();

		let has_width = ((this.props.direction == resize_direction.vertical) && (isset (nested_value (this.props.style, "width"))));
		let has_height = ((this.props.direction == resize_direction.horizontal) && (isset (nested_value (this.props.style, "height"))));

		let outer_style = {
			margin: 0, 
			padding: 0,
		}// style;

		let inner_style = {
			margin: "none",
			padding: "none",
			display: (this.props.stretchOnly || has_width || has_height) ? "block" : "inline-block"
		}// inner_style;

		if (this.props.resize == resize_state.animate) outer_style.transition = `width ${speed}ms ease-in-out, height ${speed}ms ease-in-out`;

		if (has_width) outer_style.width = this.props.style.width;
		if (has_height) outer_style.height = this.props.style.height;

		if (this.props.stretchOnly) {
			outer_style.display = "flex";
			inner_style.flex = "1"
		}// if;

		if (this.props.static) {
			if (isset (this.state.width) && this.horizontal ()) outer_style = { ...outer_style, width: this.state.width  };
			if (isset (this.state.height) && this.vertical ()) outer_style = { ...outer_style, height: this.state.height };
		}// if;

		return <div id={`${this.props.id}_outer_control`} ref={this.outer_control} style={outer_style}>
			<div id={`${this.props.id}_inner_control`} ref={this.inner_control} style={inner_style}>
				{this.props.children}
			</div>
		</div>

	}// render;


}// ResizePanel;