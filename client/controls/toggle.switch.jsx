import * as common from "classes/common";

import React from "react";
import ReactDOM from "react-dom";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";
import Settings from "classes/storage/settings";

import { default_settings, globals, horizontal_alignment } from "client/classes/types/constants";

import "client/resources/styles/controls/toggle.switch.css";


const item_width = 24;


export default class ToggleSwitch extends BaseControl {


	switch = React.createRef ();
	switch_control = React.createRef ();

	options = null;

	state = { 
		drag_position: null,
		drag_offset: 0,
		option: null,
		process_change: false
	}/* state */;


	static defaultProps = {
		id: null,
		speed: Settings.animation_speed (),
		value: null,		
		singleStep: false,
		showText: false,
		textAlignment: horizontal_alignment.left,
		onChange: null,
	}/* defaultProps */;


	/********/


	option_elements = () => { return Array.from (this.switch_control.current.querySelectorAll ("div.item")) }

	dragging = () => { return common.isset (this.state.drag_position) }


	selection = element => {
		let index = this.option_elements ().indexOf (element);
		if ((this.props.singleStep) && (Math.abs (index - this.state.option) > 1)) index = this.state.option + ((index > this.state.option) ? 1 : -1);
		return index;
	}// selection;


	selected_value = () => { 
		let element = this.option_elements () [this.state.option];
		return  common.isset (element.value) ? element.value : this.state.option;
	}// selected_value;


	stop_dragging = event => {
		for (let option of this.option_elements ()) {
			if (option.getBoundingClientRect ().contains ({ x: event.clientX })) this.setState ({ option: this.selection (option) })
		}// for;
		this.setState ({ drag_position: null, drag_offset: 0 });
	}// stop_dragging;


	transition_end = event => {
		if (event.propertyName != "left") return;
		if (this.state.process_change) this.execute (this.props.onChange, this.selected_value ()).then (() => this.setState ({ process_change: false }));
	}// transition_end;


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

		let index = (common.is_empty (this.props.children) || common.not_set (this.state.option)) ? 0 : this.state.option;
		let control_style = { left: ((item_width + 2) * index) + this.state.drag_offset }

		if (common.is_null (this.state.drag_position)) control_style = { ...control_style, transition: `left ${this.props.speed}ms ease-in-out`}

		return <div style={{ position: "relative" }}>
			<div ref={this.switch_control} className={this.props.showText ? "two-column-grid" : null} style={{ ...this.props.style, position: "relative" }}>

				{!this.props.textAlignment.equals (horizontal_alignment.left) && <div style={this.props.showText ? null : { display: "none" }}>{this.props.value}</div>}

				<div id={this.props.id} className="toggle-switch unselectable">

					{common.is_empty (this.props.children) ? null : this.props.children.map (child => {
						return <div id={child.props.id} className="item" key={child.props.children} title={child.props.children} 
						
							onClick={event => this.setState ({ 
								process_change: true, 
								option: this.selection (event.target)
							})}>
							
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
		</div>
	};

}// ToggleSwitch;