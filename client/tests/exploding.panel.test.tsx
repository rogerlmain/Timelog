import React from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import { iResizable } from "client/controls/panels/resize.panel";


interface explodingPanelTestState extends DefaultState {
	contents: any;
	item: string;
}// explodingPanelTestState;


export default class ExplodingPanelTest extends BaseControl<DefaultProps, explodingPanelTestState> {

	public state: explodingPanelTestState = {
		contents: null,
		item: null
	}// state;


	public constructor (props: DefaultProps) {
		super (props);
		this.state.item = "none";
	}// constructor;


	public render () {

		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<ExplodingPanel id="test_panel" speed={2000}>

							{this.state_equals ("item", "small") && <div style={{ border: "solid 1px green" }}>Small Item</div>}

							{this.state_equals ("item", "medium") && <div style={{ border: "solid 1px green" }}>
								This is extra test content<br />
								With a second line...
							</div>}

							{this.state_equals ("item", "large") && <div style={{ border: "solid 1px green" }}>
								blah blah blah blahy blah<br />
								blllaaahhh blah blah blah blahy blah<br />
								blah blah blahby blahy blah blech<br />
								<br />
								<textarea></textarea>
							</div>}

						</ExplodingPanel>
					</div>

				</div>

				<br />

				<button onClick={() => this.setState ({ item: "small" })}>Small contents</button>
				<button onClick={() => this.setState ({ item: "medium" })}>Mediocre contents</button>
				<button onClick={() => this.setState ({ item: "large" })}>Big contents</button>

				<br />

				<button onClick={() => this.setState ({ item: null })}>Clear contents</button>

			</div>
		)
	}// render;

}// ExplodingPanelTest;