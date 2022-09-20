import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import { is_function, is_null, not_empty } from "client/classes/common";
import { horizontal_alignment, tracing, vertical_alignment } from "client/classes/types/constants";


export const resize_direction = {
	both		: 0,
	horizontal	: 1,
	vertical	: 2
}// resize_direction;


export default class ResizePanel extends BaseControl {


	transitioning = false;


	outer_control = React.createRef ();
	inner_control = React.createRef ();
	

	state = {  animating: false }


	static defaultProps = {
		id: null,
		speed: null,

		switch: null,

		hAlign: horizontal_alignment.center,
		vAlign: vertical_alignment.middle,

		direction: resize_direction.both,
		stretchOnly: false,
	}// defaultProps;


	constructor (props) {

		super (props);
		
		if (is_null (this.props.id)) throw "ResizePanel requires an ID";
		if (tracing) console.log (`resize_panel '${this.props.id}' created`);

	}// constructor;


	/********/


	animate = () => this.setState ({ animating: true });

	freeze = callback => {
		this.outer_control.current.freeze ();
		if (is_function (callback)) callback ();
	}// freeze;

	null_if = (value, threshold) => { return (value == threshold ? null : value) }

	horizontal = () => { return ((this.props.direction == resize_direction.horizontal) || (this.props.direction == resize_direction.both)) }
	vertical = () => { return ((this.props.direction == resize_direction.vertical) || (this.props.direction == resize_direction.both)) }


	end_update () {

		if (this.props.stretchOnly) this.outer_control.current.semifreeze ();

		this.outer_control.current.thaw ();
		this.setState ({ animating: false }, () => this.execute (this.props.afterResizing));
		
	}// end_update;
	
	
	update_size () {

		let update = null;

		let ready = true;
		let image_list = this.outer_control.current.querySelectorAll ("img");

		let inner_size = this.inner_control.current.client_size ();
		let outer_size = this.outer_control.current.offset_size ();

		image_list.forEach (image => { if (!image.complete) ready = false });
		if (!ready) return setTimeout (this.update_size.bind (this));

		update = {
			width: (this.horizontal () && (this.props.stretchOnly ? (inner_size.width > outer_size.width) : (inner_size.width != outer_size.width))),
			height: (this.vertical () && (this.props.stretchOnly ? (inner_size.height > outer_size.height) : (inner_size.height != outer_size.height))),
		}// update;

		if (!(update.width || update.height)) return this.end_update ();
		if ((this.props.stretchOnly) && (inner_size.width <= outer_size.width) && (inner_size.height <= outer_size.height) && (not_empty (this.outer_control.current.style.width))) this.end_update ();
			
		if (update.width || update.height) {
			if ((update.width) && ((inner_size.width > outer_size.width) || (!this.props.stretchOnly))) this.outer_control.current.style.width = `${inner_size.width}px`;
			if ((update.height) && ((inner_size.height > outer_size.height) || (!this.props.stretchOnly))) this.outer_control.current.style.height = `${inner_size.height}px`;
		}// if;

	}// update_size;


	/********/


	transition_start = (event) => {

		let resize_width = (this.outer_control.current.clientWidth != this.inner_control.current.clientWidth);
		let resize_height = (this.outer_control.current.clientHeight != this.inner_control.current.clientHeight);

		if (this.props.stretchOnly) {
			resize_width = (this.outer_control.current.clientWidth < this.inner_control.current.clientWidth);
			resize_height = (this.outer_control.current.clientHeight < this.inner_control.current.clientHeight);
		}// if;

		if (!(resize_width || resize_height)) return this.transition_end (event); // nothing to do;
		if (event.propertyName.equals ("width") && resize_width && resize_height) return;// only one handler required;

		this.transitioning = true;
		this.execute (this.props.beforeResizing, event);

	}//transition_start;


	transition_end = (event) => {

		if (event.target !== this.outer_control.current) return;
		if (!this.transitioning) return;

		this.transitioning = false;
		this.end_update ();

	}// transition_end;


	/********/


	componentDidUpdate = () => { if (this.state.animating) this.update_size () };


	componentDidMount () {
		this.outer_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.outer_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	render () {

		const outer_style = { 
			display: "flex",
			justifyContent: this.props.hAlign,
			alignItems: this.props.vAlign,
			fontSize: 0,
		}// outer_style;

		const inner_style = {
			margin: "none",
			padding: "none",
			display: "inline-block",
			//position: "relative",
		}// inner_style;
		
		let speed = this.animation_speed ();
		
		let outer_control_id = `${this.props.id ?? `resize_panel_${Date.now ()}`}_outer_control`;
		let inner_control_id = `${this.props.id ?? `resize_panel_${Date.now ()}`}_inner_control`;

		outer_style.transition = `width ${speed}ms ease-in-out, height ${speed}ms ease-in-out`;

		switch (this.props.direction) {
			case resize_direction.horizontal: outer_style.width = "100%"; break;
			case resize_direction.vertical: outer_style.height = "100%"; break;
		}// switch;

		return <div id={outer_control_id} key={outer_control_id} ref={this.outer_control} style={outer_style}>
			<div id={inner_control_id} key={inner_control_id} ref={this.inner_control} style={inner_style}>{this.props.children}</div>
		</div>

	}// render;


}// ResizePanel;