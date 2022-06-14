import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ResizePanel, { resize_state } from "controls/panels/resize.panel";


export default class ResizePanelTest extends BaseControl {


	resize_panel = React.createRef ();


	/********/


	state = { 

contents: null,

		selected_index: 1,
		frozen: true,
		resize: resize_state.false
	}// state;


	render () {
		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<ResizePanel id="test" ref={this.resize_panel} resize={this.state.resize} frozen={this.state.frozen} parent={this}>

							{(this.state.selected_index == 1) && <div>
								Teeny line<br />
							</div>}

							{(this.state.selected_index == 2) && <div>
								This is the test content<br />
								With a second line...
							</div>}

							{(this.state.selected_index == 3) && <div>
								This is the new content in a longer line.<br />
								With even more rows<br />
								This line is also different
							</div>}

							{(this.state.selected_index == 4) && <div>
								Here's one with a text area<br />
								<textarea />
							</div>}

						</ResizePanel>
					</div>

				</div>

				<button onClick={() => this.setState ({ selected_index: 1 })}>Teeny contents</button>
				<button onClick={() => this.setState ({ selected_index: 2 })}>Medium contents</button>
				<button onClick={() => this.setState ({ selected_index: 3 })}>Large contents</button>
				<button onClick={() => this.setState ({ selected_index: 4 })}>With textarea</button>

				<br /><br />

				<button onClick={() => this.setState ({ selected_index: 0 })}>Clear contents</button>
				<button onClick={() => this.setState ({ resize: resize_state.false }, () => alert (this.state.resize))}>Clear resize</button>

				<br /><br />

				<button onClick={() => this.setState ({ resize: resize_state.true })}>Resize</button>
				<button onClick={() => this.setState ({ resize: resize_state.animate })}>Animate</button>
				<button onClick={() => this.setState ({ frozen: false })}>Unfreeze</button>

			</div>
		);
	}// render;

	
}// ResizePanelTest;