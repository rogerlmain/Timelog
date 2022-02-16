import * as React from "react";

import * as common from "client/classes/common";

import BaseControl, { DefaultProps } from "controls/base.control";
import { SyntheticEvent } from "react";



const flash_speed = 70;
const flash_repeats = 3;

const selected_color: string = "white";
const selected_background: string = "black";

const unselected_color: string = "black";
const unselected_background: string = "white";


interface selectButton extends DefaultProps {

	name?: string;

	onclick?: any;
	beforeClick?: any;

	style?: any;

	sticky?: boolean;
	submit?: boolean;

}// selectButton;


export default class SelectButton extends BaseControl<selectButton> {


	private button_reference: React.RefObject<HTMLButtonElement> = React.createRef ();
	private id: string = this.props.id;

	private sticky = false;
	private submit = false;


	private change_color = (event: SyntheticEvent, select_value: boolean, count: number) => {
		this.setState ({ selected: select_value });
		if (count > 0) {
			setTimeout (() => { this.change_color (event, !select_value, --count) }, flash_speed);
		} else {
			this.setState ({ selected: this.sticky, flashing: false });
			this.execute_event (this.props.onclick, {...event, button: this});
		}// if;
	}// change_color;


	private flash = (event: SyntheticEvent) => {

		if (!this.submit) event.preventDefault ();

		this.execute_event (this.props.beforeClick);
		this.setState ({ flashing: true });
		this.change_color (event, true, flash_repeats * 2); // twice - once for on and once for off

	}// flash;


	/********/


	public state = {
		selected: false,
		flashing: false
	}// state;


	public componentDidMount () {
		if (common.isset (this.props.sticky)) this.sticky = this.props.sticky;
		if (common.isset (this.props.submit)) this.submit = this.props.submit;
	}// componentDidMount;


	public render () {
		return (
			<button id={this.id} name={this.props.name} className={this.props.className} disabled={this.props.disabled}
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