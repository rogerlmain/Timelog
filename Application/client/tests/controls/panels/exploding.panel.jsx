import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ExplodingPanel from "client/controls/panels/exploding.panel";


export default class ExplodingPanelTest extends BaseControl {


	outer_panel = React.createRef ();
	inner_panel = React.createRef ();


	state = {
		contents: null,
		page: "large",
		animating: false,
		toggle: false,
		index: 1,
	}// state;


	get_page (index) {

		const get_contents = () => {
			if (this.state.toggle) return <div style={{ border: "solid 1px blue", margin: "1em" }}>visible stuff</div>;
			return <div style={{ border: "solid 1px blue", margin: "1em" }}>Other page of much bigger and<br />multilined other stuff<br />with even more<br />lines.</div>;
		}/* get_contents */;

		switch (index) {

			case 1: return <div style={{ border: "solid 1px green" }} id="small">
				Small Item
			</div>

			case 2: return <div style={{ border: "solid 1px green" }} id="medium">
				This is extra test content<br />
				With an image:<br />
				<br />
				<img src="resources/images/bundy.png" style={{ width: "150px", height: "auto" }} />
			</div>

			case 3: return <div key="large_page" style={{ border: "solid 1px green" }} id="large">
				<button onClick={() => this.inner_panel.current.animate (() => this.setState ({ toggle: !this.state.toggle }))}>Click me</button><br />

				<ExplodingPanel parent={this} ref={this.inner_panel} id="inner_exploder" key="inner_exploder">
					{get_contents ()}
				</ExplodingPanel>

			</div>

			case 4: return <div key="textarea_page" style={{ border: "solid 1px green" }}><textarea /></div>

			default: return null;

		}// switch;

	}// get_page;


	animate = new_index => this.outer_panel.current.animate (() => this.setState ({ index: new_index }));
	

	render () {
		return <div style={{ border: "solid 1px blue", padding: "2em"}}>

			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

				<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
					<ExplodingPanel ref={this.outer_panel} id="outer_exploder" key="outer_exploder" parent={this} stretchOnly={false}>
						{this.get_page (this.state.index)}
					</ExplodingPanel>
				</div>

			</div>

			<br />

			<button onClick={() => this.animate (1)}>Small contents</button>
			<button onClick={() => this.animate (2)}>Mediocre contents</button>
			<button onClick={() => this.animate (3)}>Big contents</button>
			<button onClick={() => this.animate (4)}>Textarea</button>

			<br />

			<button onClick={() => this.animate (0)}>Clear contents</button>

		</div>
	}// render;

}// ExplodingPanelTest;