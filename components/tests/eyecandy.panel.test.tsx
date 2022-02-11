import React from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";


interface eyecandyPanelTestProps extends DefaultProps { 
	visible?: boolean;
	static?: boolean;
}// eyecandyPanelTestProps;


interface eyecandyPanelTestState extends DefaultState {
	eyecandy_visible: boolean;
	item: number;
	static: boolean;
}// eyecandyPanelTestState;


export default class EyecandyPanelTest extends BaseControl<eyecandyPanelTestProps, eyecandyPanelTestState> {


	private eyecandy_panel: React.RefObject<EyecandyPanel> = React.createRef ();


	public state: eyecandyPanelTestState = {
		eyecandy_visible: false,
		item: 0,
		static: true
	}// state;


	public render () {

		return (
			<div style={{ border: "solid 1px blue", padding: "1em" }}>
								
				<div style={{ border: "solid 1px red", padding: "0.5em", display: "flex" }}>

					<EyecandyPanel id="eyecandy_test" ref={this.eyecandy_panel} eyecandyActive={this.state.eyecandy_visible} static={this.state.static}>

						<div style={{ border: "solid 1px green", ...this.set_visibility (this.state.item, 1) }}>
							Small Item
						</div>

						<div style={{ border: "solid 1px green", ...this.set_visibility (this.state.item, 2) }}>
							blah blah blah blahy blah<br />
							blllaaahhh blah blah blah blahy blah<br />
							blah blah blahby blahy blah blech
						</div>

						<div style={{ border: "solid 1px green", ...this.set_visibility (this.state.item, 3) }}>
							This is extra test content<br />
							With a second line...
						</div>

					</EyecandyPanel>

				</div>

				<br />

				<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: "0.2em" }}>

					<button onClick={() => this.setState ({ eyecandy_visible: true })}>Show Eyecandy</button>
					<button onClick={() => this.setState ({ eyecandy_visible: false })}>Hide Eyecandy</button>

					<button onClick={() => this.setState ({ item: 2 })}>Bigger Contents</button>
					<button onClick={() => this.setState ({ item: 3 })}>Smaller Contents</button>

					<button className="span-all-columns" onClick={() => this.setState ({ item: 0 })}>Clear</button>

				</div>

			</div>
		);

	}// render;

}// EyecandyPanelTest;
