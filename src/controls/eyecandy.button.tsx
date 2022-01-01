import * as React from "react";

import BaseControl, { DefaultProps } from "controls/base.control";
import Eyecandy from "./eyecandy";
import ExplodingPanel from "./fade.control";
import SelectButton from "./select.button";


interface eyecandyButtonInterface extends DefaultProps {

	name?: string;
	onClick?: any;

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
						if (this.execute (this.props.onClick)) this.setState ({ eyecandy_visible: false });
					}}
					afterHiding={() => { this.setState ({ button_visible: true }) }}>
				</Eyecandy>

				<ExplodingPanel visible={this.state.button_visible} className="middle-right-container"
					afterHiding={() => { this.setState ({ eyecandy_visible: true }) }}>
					<SelectButton sticky={false} onClick={() => { this.setState ({ button_visible: false }) }}>{this.props.children}</SelectButton>
				</ExplodingPanel>

			</div>
		);
	}// render;


}// EyecandyButton;