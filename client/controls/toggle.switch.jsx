import React from "react";
import BaseControl from "controls/base.control";

import { isset, not_set } from "classes/common";
import { globals } from "types/globals";

import "resources/styles/controls/toggle.switch.css";
import { horizontal_alignment } from "client/types/constants";


const item_width = 24;


export default class ToggleSwitch extends BaseControl {


	static defaultProps = {
		id: null,
		speed: null,
		value: null,		
		singleStep: false,
		showText: false,
		textAlignment: horizontal_alignment.left,
		onChange: null,
	}// defaultProps;


	state = { option: null }


	switch = React.createRef ();


	transition_end (event) {
		if (event.propertyName != "left") return;
		this.execute (this.props.onChange, this.state);
	}// transition_end;


	componentDidMount () { 
		this.switch.current.addEventListener ("transitionend", this.transition_end.bind (this));
		this.setState ({ option: this.props.value });
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) this.setState ({ option: new_props.value });
		return true;
	}// shouldComponentUpdate;


	render () {

		let speed = this.props.speed ?? globals.settings.animation_speed;
		let index = this.props.children.get_index (this.props.children.find (item => this.state.option == (isset (item.props.value) ? item.props.value : this.props.children.indexOf (item))));

		return (

			<div className={this.props.showText ? "two-column-grid" : null} style={this.props.style}>

				{!this.props.textAlignment.matches (horizontal_alignment.right) && <div style={this.props.showText ? null : { display: "none" }}>{this.props.value}</div>}

				<div id={this.props.id} className="toggle-switch unselectable">

					{this.props.children ? this.props.children.map (child => {
						return <div className="item" key={child.props.children} title={child.props.children} onClick={event => {

							let selection = child.props.value ?? Array.prototype.indexOf.call (event.target.parentNode.children, event.target) + 1;

							if ((this.props.singleStep) && (Math.abs (selection - this.state.option) > 1)) selection = this.state.option + ((selection > this.state.option) ? 1 : -1);
							
							this.setState ({ option: selection });
							
						}}></div>
					}) : null}

					<div className="switch" ref={this.switch} style={{
						transition: `left ${speed}ms ease-in-out`,
						left: (item_width + 2) * (index)
					}}></div>

				</div>

				{this.props.textAlignment.matches (horizontal_alignment.right) && <div style={this.props.showText ? null : { display: "none" }}>{this.props.value}</div>}

			</div>

		);

	};

}// ToggleSwitch;