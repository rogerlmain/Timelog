import React from "react";
import BaseControl from "controls/base.control";

import { globals } from "types/globals";

import "resources/styles/controls/toggle.switch.css";

const item_width = 24;


export default class ToggleSwitch extends BaseControl {


	switch = React.createRef ();


	state = { option: 1 }


	transition_end (event) {
		if (event.propertyName != "left") return;
		this.execute (this.props.onChange);
		this.forceUpdate ();
	}// transition_end;


	componentDidMount () { this.switch.current.addEventListener ("transitionend", this.transition_end.bind (this)) }


	render () {

		let speed = this.props.speed ?? globals.settings.animation_speed;

		return (
			<div style={{ display: "inline" }}>
				<div id={this.props.id} className="toggle-switch">

					{this.props.children ? this.props.children.map (child => {
						return <div className="item" key={child.props.children} onClick={event => this.setState ({ 
							option: Array.prototype.indexOf.call (event.target.parentNode.children, event.target) + 1
						})}></div>
					}) : null}

					<div className="switch" ref={this.switch} style={{
						transition: `left ${speed}ms ease-in-out`,
						left: (this.state.option - 1) * (item_width + 2)
					}}></div>

				</div>
			</div>
		);

	};

}// ToggleSwitch;