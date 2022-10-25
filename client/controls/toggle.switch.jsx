import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import { horizontal_alignment } from "client/classes/types/constants";
import { isset, is_empty, is_null, is_number, not_function, not_set } from "client/classes/common";

import "resources/styles/controls/toggle.switch.css";


const item_width = 24;


export default class ToggleSwitch extends BaseControl {


	switch = React.createRef ();
	switch_control = React.createRef ();

	options = null;

	state = { 
		drag_position: null,
		drag_offset: 0,
		option: null,
	}/* state */;


	static defaultProps = {

		id: null,

		speed: null,
		value: null,		
		singleStep: false,
		showText: false,
		textAlignment: horizontal_alignment.left,

		onChange: null,
		onClick	: null,

	}/* defaultProps */;


	/********/


	option_elements = () => { return Array.from (this.switch_control.current.querySelectorAll ("div.item")) }

	dragging = () => { return isset (this.state.drag_position) }


	selection = element => {
		let index = this.option_elements ().indexOf (element);
		if ((this.props.singleStep) && (Math.abs (index - this.state.option) > 1)) index = this.state.option + ((index > this.state.option) ? 1 : -1);
		return index;
	}// selection;


	selected_value = () => { 
		let element = this.option_elements () [this.state.option];
		let value = element.getAttribute ("value");
		return  isset (value) ? value : this.state.option;
	}// selected_value;


	stop_dragging = event => {

		let centered = ((this.state.drag_offset % (item_width + 2)) == 0);
		
		for (let option of this.option_elements ()) {
			if (option.getBoundingClientRect ().contains ({ x: event.clientX })) this.setState ({ option: this.selection (option) })
		}// for;

		this.setState ({ drag_position: null, drag_offset: 0 }, () => { if (centered) this.execute (this.props.onChange, this.selected_value ()) }); 

	}// stop_dragging;


	transition_end = event => {
		if (event.propertyName != "left") return;
		this.execute (this.props.onChange, this.selected_value ());
	}// transition_end;


	option_index = () => {
		if (is_number (this.state.option)) return parseInt (this.state.option);
		let result = this.props.children.find (child => child.props.value == this.state.option);
		return (isset (result)) ? this.props.children.indexOf (result) : 0;
	}// option_index;


	/********/


	componentDidMount () { 
		this.switch.current.addEventListener ("transitionend", this.transition_end);
		this.setState ({ option: this.props.value });
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ option: new_props.value });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {

		let index = (is_empty (this.props.children) || not_set (this.state.option)) ? 0 : this.option_index ();
		let control_style = { left: ((item_width + 2) * index) + this.state.drag_offset }

		if (is_null (this.state.drag_position)) control_style = { ...control_style, transition: `left ${this.animation_speed ()}ms ease-in-out`}

		return <div ref={this.switch_control} className={this.props.showText ? "two-column-grid" : null} style={{ ...this.props.style, position: "relative" }}>

			{!this.props.textAlignment.equals (horizontal_alignment.left) && <div style={this.props.showText ? null : { display: "none" }}>{this.props.value}</div>}

			<div id={this.props.id} className="toggle-switch unselectable">

				{is_empty (this.props.children) ? null : this.props.children.map (child => {
					return <div id={child.props.id} className="item" key={child.props.children} value={child.props.value} title={child.props.children} 
						onClick={event => {
							event.target.value = this.selection (event.target);
							if (not_function (this.props.onClick) || this.props.onClick (event)) this.setState ({ option: event.target.value });
						}}>
					</div>
				})}

				<div className="switch" ref={this.switch} 

					onMouseDown={event => this.setState ({ drag_position: event.clientX })}
					onMouseMove={event => { if (this.dragging ()) this.setState ({ drag_offset: (event.clientX - this.state.drag_position) }) }}

					onMouseLeave={event => { if (this.dragging ()) this.stop_dragging (event) }}
					onMouseUp={this.stop_dragging}

					style={control_style}
				
				></div>

			</div>

			{this.props.textAlignment.equals (horizontal_alignment.right) && <div style={this.props.showText ? null : { display: "none" }}>{this.props.value}</div>}

		</div>
	}// render;


}// ToggleSwitch;