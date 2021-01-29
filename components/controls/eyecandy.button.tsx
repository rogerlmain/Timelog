import * as React from "react";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import Eyecandy from "./eyecandy";
import FadeControl from "./fade.control";
import SelectButton from "./select.button";


interface eyecandyButtonInterface extends defaultInterface {

	name?: string;
	onclick?: any;

	text: string;
	subtext?: string;

}// eyecandyButtonInterface;


export default class EyecandyButton extends BaseControl<eyecandyButtonInterface> {


	public state = {

		eyecandy: false,
		flashing: false,

		eyecandy_visible: false,
		button_visible: true

	}// state;


	public render () {
		return (
			<div className="eyecandy-button-panel overlay-container">

				<Eyecandy visible={this.state.eyecandy_visible}
					text={this.props.text}
					subtext={this.props.subtext}
					afterShowing={() => {
						if (this.execute_event (this.props.onclick)) this.setState ({ eyecandy_visible: false });
					}}
					afterHiding={() => { this.setState ({ button_visible: true }) }}>
				</Eyecandy>

				<FadeControl visible={this.state.button_visible} className="middle-right-container"
					afterHiding={() => { this.setState ({ eyecandy_visible: true }) }}>
					<SelectButton sticky={false} onclick={() => { this.setState ({ button_visible: false }) }}>{this.props.children}</SelectButton>
				</FadeControl>

			</div>
		);
	}// render;


}// EyecandyButton;