import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";

import Container from "client/controls/container";


export default class ExplodingPanelTest extends BaseControl {

	state = {
		contents: null,
		show_small: false,
		show_medium: false,
		show_large: false,
	}// state;


	constructor (props) {
		super (props);
		this.state.item = "none";
	}// constructor;


	render () {
		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<ExplodingPanel id="test_panel" speed={500}>

							<Container id="small" visible={this.state.show_small}><div style={{ border: "solid 1px green" }} id="small">
								Small Item
							</div></Container>

							<Container id="medium" visible={this.state.show_medium}><div style={{ border: "solid 1px green" }} id="medium">
								This is extra test content<br />
								With a second line...
							</div></Container>

							<Container id="large" visible={this.state.show_large}><div style={{ border: "solid 1px green" }} id="large">
								blah blah blah blahy blah<br />
								blllaaahhh blah blah blah blahy blah<br />
								blah blah blahby blahy blah blech<br />
								<br />
								<textarea></textarea>
							</div></Container>

						</ExplodingPanel>
					</div>

				</div>

				<br />

				<button onClick={() => this.setState ({ show_small: !this.state.show_small })}>Small contents</button>
				<button onClick={() => this.setState ({ show_medium: !this.state.show_medium })}>Mediocre contents</button>
				<button onClick={() => this.setState ({ show_large: !this.state.show_large })}>Big contents</button>

				<br />

				<button onClick={() => this.setState ({ 
					show_small: false,
					show_medium: false,
					show_large: false,
				 })}>Clear contents</button>

			</div>
		)
	}// render;

}// ExplodingPanelTest;