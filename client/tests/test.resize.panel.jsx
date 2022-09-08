import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ResizePanel from "client/controls/panels/resize.panel";
import Container from "client/controls/container";
import { horizontal_alignment } from "client/classes/types/constants";


import test_image from "resources/images/square.png";


export default class ResizePanelTest extends BaseControl {


	contents = null;

	resize_panel = React.createRef ();
	nested_panel = React.createRef ();


	/********/


	state = { 

contents: null,

		selected_index: 1,
		frozen: false,
		
		animating: false,

	}// state;


	get_page (index) {


		const get_piece = index => (index == 1) ? <div>First Index</div> : <div>A different thing altogether</div>;


		switch (index) {

			case 1: return <Container>Teeny line</Container>
			case 2: return <Container>
				This is the test content<br />
				With a second line...
			</Container>

			case 3: return <Container>
				This is the new content in a longer line.<br />
				With even more rows<br />

				<div className="borderline">
					<ResizePanel id="test2" parent={this} ref={this.nested_panel} stretchOnly={false} alignment={horizontal_alignment.center} animating={this.state.animating}>
						<div className="horizontally-centered">
							{get_piece (1)}
						</div>
					</ResizePanel>
					<button onClick={() => this.nested_panel.current.animate (get_piece (1))}>First</button>
					<button onClick={() => this.nested_panel.current.animate (get_piece (2))}>Another</button>
				</div>

				This line is also different
			</Container>

			case 4: return <Container>
				Here's one with a text area<br />
				<textarea />
			</Container>

			case 5: return <Container>
				this<br />
				one<br />
				is<br />
				very<br />
				long
			</Container>

			case 6: return <Container>
				Here's one with an image<br />
				<img src={test_image} style={{ width: "200px", height: "auto" }} />
			</Container>

			default: return null;

		}// switch;

	}// get_page;


	render () {
		return <div style={{ border: "solid 1px blue", padding: "2em"}}>

			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

				<div style={{ border: "solid 1px red", display: "inline-block" }}>
					<ResizePanel id="test" parent={this} ref={this.resize_panel} stretchOnly={false} alignment={horizontal_alignment.center} animating={this.state.animating}>
						{this.get_page (1)}
					</ResizePanel>
				</div>

			</div>

			<br /><br />

			<button onClick={() => this.resize_panel.current.animate (this.get_page (0))}>Clear contents</button>
			<button onClick={() => this.resize_panel.current.animate (this.get_page (1))}>Teeny contents</button>
			<button onClick={() => this.resize_panel.current.animate (this.get_page (2))}>Medium contents</button>
			<button onClick={() => this.resize_panel.current.animate (this.get_page (3))}>Large contents</button>
			<button onClick={() => this.resize_panel.current.animate (this.get_page (4))}>With textarea</button>
			<button onClick={() => this.resize_panel.current.animate (this.get_page (5))}>Long one</button>
			<button onClick={() => this.resize_panel.current.animate (this.get_page (6))}>Image included</button>

			<br /><br />

			<button onClick={() => this.setState ({ animating: true })}>Resize</button>

		</div>
	}// render;

	
}// ResizePanelTest;