import React from "react";

import BaseControl from "client/controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";

import SettingsPanel from "client/pages/settings";


export default class ExplodingPanelTest extends BaseControl {

	state = {
		contents: null,
		item: null
	}// state;


	constructor (props) {
		super (props);
		this.state.item = "none";
	}// constructor;


	render () {

		let contents = (this.state.item == "none") ? null : <div>

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

			{this.state_equals ("item", "settings") && <div style={{ border: "solid 1px green" }}>
				<SettingsPanel />
			</div>}

		</div>;


		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<ExplodingPanel id="test_panel" speed={1000} stretchOnly={false} contents={contents} />
					</div>

				</div>

				<br />

				<button onClick={() => this.setState ({ item: "small" })}>Small contents</button>
				<button onClick={() => this.setState ({ item: "medium" })}>Mediocre contents</button>
				<button onClick={() => this.setState ({ item: "large" })}>Big contents</button>
				<button onClick={() => this.setState ({ item: "settings" })}>Settings</button>

				<br />

				<button onClick={() => this.setState ({ item: null })}>Clear contents</button>

			</div>
		)
	}// render;

}// ExplodingPanelTest;