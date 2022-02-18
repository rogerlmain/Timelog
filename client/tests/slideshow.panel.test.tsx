import React from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import SlideshowPanel from "controls/panels/slideshow.panel";


interface explodingPanelTestState extends DefaultState {
	index: number;
}// explodingPanelTestState;


export default class ExplodingPanelTest extends BaseControl<DefaultProps, explodingPanelTestState> {

	public state: explodingPanelTestState = {
		index: 0
	}// state;


	public constructor (props: DefaultProps) {
		super (props);
	}// constructor;


	public render () {

		return (
			<div style={{ border: "solid 1px blue", padding: "2em"}}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<SlideshowPanel id="the_test_thingy" index={this.state.index}>

							<div>
								Lorem ipsum dolor sit amet
							</div>

							<div>
								consectetur adipiscing elit. Nullam at dictum mi.<br />
								Proin cursus neque vel accumsan molestie. Suspendisse
							</div>

							<div>
								volutpat lacinia ligula non egestas. Morbi ante dui, eleifend faucibus<br />
								facilisis finibus, aliquet eu neque. Nulla dignissim vel tellus vitae<br />
								lacinia. Duis sit amet luctus quam. Curabitur et rutrum orci. Aliquam<br />
								volutpat maximus ornare. Sed imperdiet felis felis, nec lacinia nulla 
							</div>

						</SlideshowPanel>
					</div>

				</div>

				<button onClick={() => this.setState ({ index: 1 })}>Small contents</button>
				<button onClick={() => this.setState ({ index: 2 })}>Medium contents</button>
				<br />
				<button onClick={() => this.setState ({ index: 3 })}>large contents</button>
				<button onClick={() => this.setState ({ index: 0 })}>No contents</button>

			</div>
		)
	}// render;

}// ExplodingPanelTest;