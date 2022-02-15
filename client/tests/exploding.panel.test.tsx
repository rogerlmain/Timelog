import React from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";


interface explodingPanelTestProps extends DefaultProps { 
	visible?: boolean;
	static?: boolean;
}// explodingPanelTestProps;


interface explodingPanelTestState extends DefaultState {
	visible: boolean;
	contents: any;
	item: number;
}// explodingPanelTestState;


export default class ExplodingPanelTest extends BaseControl<explodingPanelTestProps, explodingPanelTestState> {


	private exploding_panel: React.RefObject<ExplodingPanel> = React.createRef ();


	/********/


	public state: explodingPanelTestState = { 
		visible: null, 
		contents: null,
		item: null
	}// state;

	public props: explodingPanelTestProps;
	

	public constructor (props: explodingPanelTestProps) {
		super (props);
		this.state.visible = this.state.visible ?? this.props.visible;
		this.state.item = 0;
	}// constructor;


	public render () {

		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<ExplodingPanel id="test_panel" ref={this.exploding_panel} static={this.props.static}>

							<div style={{ border: "solid 1px green", ...this.set_visibility (this.state.item, 1) }}>Small Item</div>

							<div style={{ border: "solid 1px green", ...this.set_visibility (this.state.item, 2) }}>
								blah blah blah blahy blah<br />
								blllaaahhh blah blah blah blahy blah<br />
								blah blah blahby blahy blah blech
							</div>

							<div style={{ border: "solid 1px green", ...this.set_visibility (this.state.item, 3) }}>
								This is extra test content<br />
								With a second line...
							</div>

						</ExplodingPanel>                                       
					</div>

				</div>

				<br />

				<button onClick={() => this.setState ({ visible: false })}>Implode</button>
				<button onClick={() => this.setState ({ visible: true })}>Explode</button>

				<br />

				<button onClick={() => this.setState ({ item: 1 })}>Small contents</button>
				<button onClick={() => this.setState ({ item: 2 })}>Big contents</button>
				<button onClick={() => this.setState ({ item: 3 })}>Mediocre contents</button>

				<br />

				<button onClick={() => this.setState ({ item: 0 })}>Clear contents</button>

			</div>
		)
	}

}// ExplodingPanelTest;