import React from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ResizePanel, { iResizable, resize_state } from "controls/panels/resize.panel";


interface ResizePanelTestProps extends DefaultProps { 
	static?: boolean;
}// ResizePanelTestProps;


interface ResizePanelTestState extends DefaultState {
	selected_index: number;
	resize: resize_state;
}// ResizePanelTestState;


export default class ResizePanelTest extends BaseControl<ResizePanelTestProps, ResizePanelTestState> implements iResizable {


	private resize_panel: React.RefObject<ResizePanel> = React.createRef ();


	/********/


	public state: ResizePanelTestState = { 
		selected_index: 1,
		resize: resize_state.false
	}// state;


	public render () {
		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<ResizePanel id="test" ref={this.resize_panel} resize={this.state.resize} parent={this}>

							<div style={this.set_visibility (this.state.selected_index, 1)}>
								Teeny line
							</div>

							<div style={this.set_visibility (this.state.selected_index, 2)}>
								This is the test content<br />
								With a second line...
							</div>

							<div style={this.set_visibility (this.state.selected_index, 3)}>
								This is the new content in a longer line.<br />
								With even more rows<br />
								This line is also different
							</div>

						</ResizePanel>
					</div>

				</div>

				<button onClick={() => this.setState ({ selected_index: 1 })}>Teeny contents</button>
				<button onClick={() => this.setState ({ selected_index: 2 })}>Medium contents</button>
				<button onClick={() => this.setState ({ selected_index: 3 })}>Large contents</button>

				<br /><br />

				<button onClick={() => this.setState ({ selected_index: 0 })}>Clear contents</button>
				<button onClick={() => this.setState ({ resize: resize_state.false }, () => alert (this.state.resize))}>Clear resize</button>

				<br /><br />

				<button onClick={() => this.setState ({ resize: resize_state.true })}>Resize</button>
				<button onClick={() => this.setState ({ resize: resize_state.animate })}>Animate</button>

			</div>
		);
	}// render;

}// ResizePanelTest;