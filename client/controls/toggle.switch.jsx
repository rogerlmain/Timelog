import React from "react";
import BaseControl from "controls/base.control";

import { globals } from "types/globals";

import "resources/styles/controls/toggle.switch.css";


const item_width = 24;


export default class ToggleSwitch extends BaseControl {


	static defaultProps = {
		id: null,
		speed: null,
		value: null,		
		singleStep: false,
		onChange: null,
	}// defaultProps;


	state = { option: 1 }


	switch = React.createRef ();


	transition_end (event) {
		if (event.propertyName != "left") return;
		this.execute (this.props.onChange, this.state).then (result => {		
			if (result) return;
			this.setState ({ 
				option: this.state.previous,
				previous: this.state.option
			});
		});
	}// transition_end;


	componentDidMount () { 
		this.switch.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) this.setState ({ 
			previous: this.state.option ?? this.props.value,
			option: new_props.value
		});
		return true;
	}// shouldComponentUpdate;


	render () {

		let speed = this.props.speed ?? globals.settings.animation_speed;

		return (
			<div id={this.props.id} className="toggle-switch unselectable">

				{this.props.children ? this.props.children.map (child => {
					return <div className="item" key={child.props.children} title={child.props.children} onClick={event => {

						let selection = Array.prototype.indexOf.call (event.target.parentNode.children, event.target) + 1;

						if ((this.props.singleStep) && (Math.abs (selection - this.state.option) > 1)) selection = this.state.option + ((selection > this.state.option) ? 1 : -1);
						
						this.setState ({
							previous: this.state.option,
							option: selection
						});
						
					}}></div>
				}) : null}

				<div className="switch" ref={this.switch} style={{
					transition: `left ${speed}ms ease-in-out`,
					left: (this.state.option - 1) * (item_width + 2)
				}}></div>

			</div>
		);

	};

}// ToggleSwitch;