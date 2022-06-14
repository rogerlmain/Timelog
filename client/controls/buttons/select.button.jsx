
import * as common from "classes/common";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";


const flash_speed = 70;
const flash_repeats = 3;

const selected_color = "white";
const selected_background = "black";

const unselected_color = "black";
const unselected_background = "white";


export default class SelectButton extends BaseControl {


	static defaultProps = {

		active: false,
		disabled: false,
		selected: false,
		submit: false,

		beforeClick: null,

	}// defaultProps;


	state = {
		selected: false,
		flashing: false
	}// state;

	
	button_reference = React.createRef ();


	change_color = (event, select_value, count) => {
		this.setState ({ selected: select_value });
		if (count > 0) {
			setTimeout (() => { this.change_color (event, !select_value, --count) }, flash_speed);
		} else {
			this.setState ({ selected: this.props.selected, flashing: false });
			this.execute (this.props.onClick, {...event, button: this});
		}// if;
	}// change_color;


	flash = event => {

		if (this.props.submit !== true) event.preventDefault ();

		this.execute (this.props.beforeClick);
		this.setState ({ flashing: true });
		this.change_color (event, true, flash_repeats * 2); // twice - once for on and once for off

	}// flash;


	/********/


	shouldComponentUpdate (new_props) {
		if (this.state.selected != new_props.selected) return !!this.setState ({ selected: new_props.selected });
		return true;
	}// componentDidMount;


	componentDidMount () { return this.shouldComponentUpdate (this.props) }


	render () {
		return <button id={this.props.id} name={this.props.name} className={this.props.className} disabled={this.props.disabled} ref={this.button_reference}
			style={{
				...this.props.style,
				color: this.state.selected ? selected_color : (this.state.flashing ? unselected_color: null),
				background: this.state.selected ? selected_background : (this.state.flashing ? unselected_background: null),
			}}
			onClick={this.flash}>
				
			{this.props.children}
			
		</button>
	}// render;


}// SelectButton;