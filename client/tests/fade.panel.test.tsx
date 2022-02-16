import React from "react";

import BaseControl, { DefaultState } from "controls/base.control";
import FadePanel, { iFadeable } from "controls/panels/fade.panel";


interface fadePanelTestState extends DefaultState { 
	visible: boolean;
}// fadePanelTestState;


export default class FadePanelTest extends BaseControl implements iFadeable {


	public state: fadePanelTestState = { visible: true }


	public render () {
		return (
			<div className="centering-container v" style={{ border: "solid 1px blue", padding: "2em" }}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<FadePanel id="test_panel" visible={this.state.visible} static={false} parent={this}>
							<div style={{ border: "solid 1px green" }}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
								Proin placerat faucibus dictum. Nam egestas, purus et<br />
								fermentum dui. Etiam vehicula suscipit<br />
							</div>
						</FadePanel>
					</div>
				</div>

				<br />

				<div>
					<button onClick={() => this.setState ({ visible: true })}>Fade In</button>
					<button onClick={() => this.setState ({ visible: false })}>Fade Out</button>
				</div>

			</div>
		);
	}// render;

}// FadePanelTest;