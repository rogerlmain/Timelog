import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";


export default class FadePanelTest extends BaseControl {


	state = { 
		visible: false,
		animate: false
	}// state;


	render () {
		return (
			<div className="centering-container v" style={{ border: "solid 1px blue", padding: "2em" }}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<FadePanel id="test_panel" visible={this.state.visible} animate={this.state.animate} speed={2000}>
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

				<div>
					<button onClick={() => this.setState ({ animate: false })}>Snap</button>
					<button onClick={() => this.setState ({ animate: true })}>Animate</button>
				</div>

				<div>{this.state.animate ? "animating" : "snapping"}</div>

			</div>
		);
	}// render;

}// FadePanelTest;