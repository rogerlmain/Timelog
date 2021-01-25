import * as React from "react";

import * as common from "components/classes/common";

import BaseControl, { defaultInterface } from "components/controls/base.control";



const flash_speed = 50;
const flash_repeats = 3;

const selected_color: string = "white";
const selected_background: string = "black";

const unselected_color: string = "black";
const unselected_background: string = "white";


interface selectButton extends defaultInterface {

	name?: string;

	onclick?: any;
	beforeClick?: any;

	style?: any;

	sticky?: boolean;

}// selectButton;


export default class SelectButton extends BaseControl<selectButton> {


	private button_reference: React.RefObject<HTMLButtonElement> = React.createRef ();
	private id: string = this.props.id;
	private sticky = true;


	private change_color = (select_value, count) => {
		this.setState ({ selected: select_value });
		if (count > 0) {
			setTimeout (() => { this.change_color (!select_value, --count) }, flash_speed);
		} else {
			this.setState ({ selected: this.sticky, flashing: false });
			this.execute_event (this.props.onclick);
		}// if;
	}// change_color;


	private flash = () => {

		this.execute_event (this.props.beforeClick);
		this.setState ({ flashing: true });
		this.change_color (true, flash_repeats * 2); // twice - once for on and once for off

	}// flash;


	/********/


	public state = {
		selected: false,
		flashing: false
	}// state;


	public componentDidMount () {
		if (common.isset (this.props.sticky)) this.sticky = this.props.sticky;
	}// componentDidMount;


	public render () {
		return (
			<button id={this.id} name={this.props.name}
				ref={this.button_reference}
				style={{
					...this.props.style,
					color: this.state.selected ? selected_color : (this.state.flashing ? unselected_color: null),
					background: this.state.selected ? selected_background : (this.state.flashing ? unselected_background: null),
				}}
				onClick={this.flash}>{this.props.children}
			</button>
		);
	}// render;


}// SelectButton;