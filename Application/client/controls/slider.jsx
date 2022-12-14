import * as common from "client/classes/common";

import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import { not_set } from "client/classes/common";

import "resources/styles/controls/slider.css";


export default class Slider extends BaseControl {


	static defaultProps = {
		id: null,
		min: 0,
		max: 100,
		value: 0,

		showValue: false,
		onChange: null
	}/* defaultProps */;


	state = {
		dragging: false,
		button_offset: 0,
		button_position: 0,
		value: 0
	}/* state */;


	slider_track = React.createRef ();
	slider_button = React.createRef ();

	track_value_ratio = 1;


	button_position = () => { return this.state.value * this.track_value_ratio }


	start_dragging = event => {
		this.setState ({ dragging: true });
	}// start_dragging;


	drag_handler = event => { 

		if (common.not_set (this.slider_track.current)) return;

		let rect = this.slider_track.current.getBoundingClientRect ();
		let cursor_position = (event.clientX - rect.left);

		let min_value = 0;
		let max_value = this.slider_track.current.clientWidth;

		if (this.state.dragging && (cursor_position >= min_value) && (cursor_position <= max_value)) return this.setState ({ 
			button_position: cursor_position,
			value: Math.round (cursor_position / this.track_value_ratio)
		});

	}// drag_handler;


	stop_dragging = event => {
		this.setState ({ dragging: false });
		this.execute (this.props.onChange, this.state.value);
	}// stop_dragging;


	/********/


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ value: new_props.value });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	componentDidMount () {

		if (common.not_set (this.props.id)) throw "Slider requires an ID";

		this.track_value_ratio = (this.slider_track.current.clientWidth / (this.props.max - this.props.min));

		this.setState ({ 
			button_offset: (this.slider_button.current.offsetWidth / 2 ),
			value: this.props.value
		}, () => this.setState ({ button_position: this.button_position () }));

		if (not_set (this.slider_button.current)) return;

		this.slider_button.current.addEventListener ("mousemove", this.drag_handler);
		this.slider_button.current.addEventListener ("mouseup", this.stop_dragging);

	}// componentDidMount;	


	componentWillUnmount () {
		if (not_set (this.slider_button.current)) return;
		this.slider_button.current.removeEventListener ("mousemove", this.drag_handler);
		this.slider_button.current.removeEventListener ("mouseup", this.stop_dragging);
	}// componentWillUnmount;


	render () {
		return <div className={this.props.showValue ? "two-column-grid" : null} style={{ display: "flex" }}>

			<div className="vertically-centered" style={{ flexGrow: 1 }}>
				<div id={this.props.id} className="slider">
					<div id={`${this.props.id}_track`} ref={this.slider_track} className="slider-track" />
					<div id={`${this.props.id}_button`} ref={this.slider_button} className="slider-button" style={{ left: this.state.button_position - this.state.button_offset }} onMouseDown={this.start_dragging} />
				</div>
			</div>

			<Container visible={this.props.showValue}>
				<div style={{ padding: "0 0 0 1em" }}>
					<div>{this.state.value}</div>
				</div>
			</Container>

		</div>
	}// render;


}// Slider;