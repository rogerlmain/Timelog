import React from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ResizePanel, { iResizable, resizableProps } from "controls/panels/resize.panel";


interface resizePanelTestProps extends DefaultProps { 
	static?: boolean;
}// resizePanelTestProps;


interface resizePanelTestState extends DefaultState {
	selected_index: number;
	resize: boolean;
}// resizePanelTestState;


export default class ResizePanelTest extends BaseControl<resizePanelTestProps, resizePanelTestState> implements iResizable {


	private resize_panel: React.RefObject<ResizePanel> = React.createRef ();


	/********/


	public state: resizePanelTestState = { 
		selected_index: 1,
		resize: false
	}// state;


	public props: resizePanelTestProps & resizableProps;
	

	public render () {
		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<ResizePanel ref={this.resize_panel} resize={this.state.resize} parent={this}>

							<div style={this.set_visibility (this.state.selected_index, 1)}>
								This is the test content<br />
								With a second line...
							</div>

							<div style={this.set_visibility (this.state.selected_index, 2)}>
								This is the new content in a longer line.<br />
								With even more rows<br />
								This line is also different
							</div>

						</ResizePanel>
					</div>

				</div>

				<button onClick={() => this.setState ({ selected_index: 1 })}>Original contents</button>
				<button onClick={() => this.setState ({ selected_index: 2 })}>New contents</button>
				<button onClick={() => this.setState ({ selected_index: 0 })}>Clear contents</button>

				<br /><br />

				<button onClick={() => this.setState ({ resize: true })}>Resize</button>

			</div>
		);
	}// render;

}// ResizePanelTest;