import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ContentsPanel from "client/controls/panels/contents.panel";


export default class ContentsPanelTest extends BaseControl {


	state = { value: 0 }


	render () {
		return <div>
		
			<ContentsPanel index={this.state.value}>

				<div style={{ border: "solid 1px green" }} id="small">Small Item</div>

				<div style={{ border: "solid 1px green" }} id="medium">
					This is extra test content<br />
					With an image:<br />
					<br />
					<img src="resources/images/bundy.png" style={{ width: "150px", height: "auto" }} />
				</div>

				<div key="large_page" style={{ border: "solid 1px green" }} id="large">
					<button onClick={() => this.inner_panel.current.animate (() => this.setState ({ toggle: !this.state.toggle }))}>Click me</button><br />
				</div>

				<div key="textarea_page" style={{ border: "solid 1px green" }}><textarea /></div>

			</ContentsPanel>

			<br />

			<button onClick={() => this.setState ({ value: 0 })}>No contents</button>
			<button onClick={() => this.setState ({ value: 1 })}>Small contents</button>
			<button onClick={() => this.setState ({ value: 2 })}>Mediocre contents</button>
			<button onClick={() => this.setState ({ value: 3 })}>Big contents</button>
			<button onClick={() => this.setState ({ value: 4 })}>Textarea</button>

		</div>

	}// render;


}// ContentsPanelTest;