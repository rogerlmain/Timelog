import React, { Fragment } from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ResizePanel from "controls/panels/resize.panel";


interface resizePanelTestProps extends DefaultProps { 
	visible?: boolean;
	static?: boolean;
}// resizePanelTestProps;


interface resizePanelTestState extends DefaultState {
	selected_index: number;
	visible: boolean;
}// resizePanelTestState;


export default class ResizePanelTest extends BaseControl<resizePanelTestProps, resizePanelTestState> {


	private resize_panel: React.RefObject<ResizePanel> = React.createRef ();


	/********/


	public state: resizePanelTestState = { 
		selected_index: 1,
		visible: false 
	}// state;


	public props: resizePanelTestProps;
	

	public constructor (props: resizePanelTestProps) {
		super (props);
		this.state.visible = this.props.visible ?? this.state.visible;
//		this.state.selected_index = 0;
	}// constructor;


	public render () {
		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<ResizePanel ref={this.resize_panel} visible={this.state.visible} static={this.props.static}>

							<div style={this.set_visibility (this.state.selected_index, 1)}>
								This is the test content<br />
								With a second line...
							</div>

							<div style={this.set_visibility (this.state.selected_index, 2)}>
								This is the new content.<br />
								This line is also different
							</div>

						</ResizePanel>
					</div>

				</div>

				<button onClick={() => this.setState ({ visible: true })}>Show</button>
				<button onClick={() => this.setState ({ visible: false })}>Hide</button>

				<br />

				<button onClick={() => this.setState ({ selected_index: 1 })}>Original contents</button>
				<button onClick={() => this.setState ({ selected_index: 2 })}>New contents</button>
				<button onClick={() => this.setState ({ selected_index: 0 })}>Clear contents</button>

			</div>
		);
	}// render;

}// ResizePanelTest;