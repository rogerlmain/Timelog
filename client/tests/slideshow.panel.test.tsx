import React from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import SlideshowPanel from "controls/panels/slideshow.panel";


interface explodingPanelTestState extends DefaultState {
	contents: any;
}// explodingPanelTestState;


export default class ExplodingPanelTest extends BaseControl<DefaultProps, explodingPanelTestState> {

	public state: explodingPanelTestState = {
		contents: null
	}// state;


	public constructor (props: DefaultProps) {
		super (props);
	}// constructor;


	public render () {

		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<SlideshowPanel id="test">

							{this.state.contents}

						</SlideshowPanel>
					</div>

				</div>

				<button onClick={() => this.setState ({ contents: <div>
					Lorem ipsum dolor sit amet
				</div> })}>Small contents</button>

				<button onClick={() => this.setState ({ contents: <div>
					consectetur adipiscing elit. Nullam at dictum mi.<br />
					Proin cursus neque vel accumsan molestie. Suspendisse
				</div> })}>Medium contents</button>

				<button onClick={() => this.setState ({ contents: <div>
					volutpat lacinia ligula non egestas. Morbi ante dui, eleifend faucibus<br />
					facilisis finibus, aliquet eu neque. Nulla dignissim vel tellus vitae<br />
					lacinia. Duis sit amet luctus quam. Curabitur et rutrum orci. Aliquam<br />
					volutpat maximus ornare. Sed imperdiet felis felis, nec lacinia nulla 
				</div> })}>large contents</button>


			</div>
		)
	}// render;

}// ExplodingPanelTest;