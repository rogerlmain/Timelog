import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import Container from "client/controls/container";


export default class EyecandyPanelTest extends BaseControl {


	state = {
		eyecandy_visible: false,
		index: 1,
		selected_index: 1,
		static: true,
	}// state;


	get_contents (index) {
		switch (index) {

			case 1: return <div style={{ border: "solid 1px green" }}>
				Small Item
			</div>

			case 2: return <div style={{ border: "solid 1px green" }}>
				This is extra test content<br />
				With a second line...
			</div>

			case 3: return <div style={{ border: "solid 1px green" }}>
				blah blah blah blahy blah<br />
				blllaaahhh blah blah blah blahy blah<br />
				blah blah blahby blahy blah blech
			</div>

			default: return null;
		
		}// switch;
	}// get_contents;


	update = index => this.setState ({ 
		selected_index: index,
		eyecandy_visible: true,
	});


	render () {

		return (
			<div style={{ border: "solid 1px blue", padding: "1em" }}>
								
				<div style={{ border: "solid 1px red", padding: "0.5em", display: "flex" }}>

					<EyecandyPanel id="eyecandy_test" eyecandyVisible={this.state.eyecandy_visible} text="Testing eyecandy"
						onEyecandy={() => this.setState ({ index: this.state.selected_index, eyecandy_visible: false })}>
						{this.get_contents (this.state.index)}
					</EyecandyPanel>

				</div>

				<br />

				<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: "0.2em" }}>
{/* 
					<button onClick={() => this.setState ({ eyecandy_visible: true })}>Show Eyecandy</button>
					<button onClick={() => this.setState ({ eyecandy_visible: false })}>Hide Eyecandy</button>
*/}
					<button onClick={() => this.update (1)}>Small Contents</button>
					<button onClick={() => this.update (2)}>Medium Contents</button>
					<button onClick={() => this.update (3)}>Large Contents</button>

					<button className="span-all-columns" onClick={() => this.setState ({ index: 0 })}>Clear</button>

				</div>

			</div>
		);

	}// render;

}// EyecandyPanelTest;
