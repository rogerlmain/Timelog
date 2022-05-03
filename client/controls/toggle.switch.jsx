import * as common from "classes/common";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import Settings from "classes/storage/settings";

import { horizontal_alignment } from "client/classes/types/constants";

import "client/resources/styles/controls/toggle.switch.css";


const item_width = 24;


export default class ToggleSwitch extends BaseControl {


	switch = React.createRef ();
	switch_control = React.createRef ();

	options = null;

	state = { 
		drag_position: null,
		drag_offset: 0,
		current_index: 0,
		process_change: false,
	}/* state */;


	static defaultProps = {
		id: null,
		speed: Settings.animation_speed (),
		value: 0,
		singleStep: false,
		showText: false,
		textAlignment: horizontal_alignment.left,
		onChange: null,
	}/* defaultProps */;


	/********/


	dragging = () => { return common.isset (this.state.drag_position) }

	value_index = value => { return this.props.children.indexOf (this.get_option (value)) }
	element_index = element => { return this.elements ().indexOf (element) }

	elements = () => { return Array.from (this.switch_control.current.querySelectorAll ("div.item")) }

	current_option = () => { return this.get_option (this.state.current_index ?? 0) }
	current_value = () => { return this.props.children [this.state.current_index].props.value ?? this.state.current_index }

	selected_option = element => { return this.props.children [this.elements ().indexOf (element)] }


	get_option = value => {
		let option = this.props.children.find (child => child.props.value == value);
		if (common.isset (option)) return option;
		if (common.is_number (value)) return this.props.children [parseInt (value)];
		return null;
	}// get_option;


	stop_dragging = event => {
		for (let option of this.elements ()) {
			if (option.getBoundingClientRect ().contains ({ x: event.clientX })) this.setState ({ index: this.selected_index (option) })
		}// for;
		this.setState ({ drag_position: null, drag_offset: 0 });
	}// stop_dragging;


	transition_end = event => {
		if (event.propertyName != "left") return;
		if (this.state.process_change) this.execute (this.props.onChange, this.current_value ()).then (() => this.setState ({ process_change: false }));
	}// transition_end;


	toggle_options = () => {

		if (common.is_empty (this.props.children)) return null;

		return this.props.children.map (child => {
			return <div id={child.props.id} className="item" key={child.props.children} value={child.props.value} title={child.props.children} 
			
				onClick={event => {
					
					let next_index = this.element_index (event.target);

					this.setState ({ 
						process_change: true, 
						current_index: (this.props.singleStep ? ((this.state.current_index > next_index) ? -1 : 1) : next_index)
					})
				
				}}>
				
			</div>
		});
	}/* toggle_options */;


	toggle_switch = () => {

		let control_style = { left: ((item_width + 2) * this.state.current_index) + this.state.drag_offset }

		if (common.is_null (this.state.drag_position)) control_style = { ...control_style, transition: `left ${this.props.speed}ms ease-in-out`}

		return <div className="switch" ref={this.switch} 

			onMouseDown={event => this.setState ({ drag_position: event.clientX })}
			onMouseMove={event => { if (this.dragging ()) this.setState ({ drag_offset: (event.clientX - this.state.drag_position) }) }}

			onMouseLeave={event => { if (this.dragging ()) this.stop_dragging (event) }}
			onMouseUp={this.stop_dragging}

			style={control_style}>
		
		</div>
	}/* toggle_switch */;


	/********/


	componentDidMount () { 
		this.switch.current.addEventListener ("transitionend", this.transition_end);
		this.setState ({ current_index: this.value_index (this.props.value) });
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ current_index: this.value_index (new_props.value) });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {
		return <div style={{ position: "relative" }}>
			<div ref={this.switch_control} className={this.props.showText ? "two-column-grid" : null} style={{ ...this.props.style, position: "relative" }}>

				{!this.props.textAlignment.equals (horizontal_alignment.left) && <div style={this.props.showText ? null : { display: "none" }}>{this.props.value}</div>}

				<div id={this.props.id} className="toggle-switch unselectable">

					{this.toggle_options ()}
					{this.toggle_switch ()}
					
				</div>

				{this.props.textAlignment.equals (horizontal_alignment.right) && <div style={this.props.showText ? null : { display: "none" }}>{this.props.value}</div>}

			</div>
		</div>
	}// render;


}// ToggleSwitch;