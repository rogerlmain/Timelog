import React from "react";
import BaseControl from "controls/base.control";

import { globals } from "types/globals";
import ExplodingPanel from "client/controls/panels/exploding.panel";
import ResizePanel, { iResizable, resize_state } from "client/controls/panels/resize.panel";


export default class HomePage extends BaseControl<any> implements iResizable {


	public componentDidMount () {
		setTimeout (() => { globals.master_panel.setState ({ content_loaded: true }) });
	}// componentDidMount;


image_ref = React.createRef<HTMLImageElement> ();	


state = {
	resize: resize_state.false,
	image_source: "resources/images/data.indicatorr.gif"
}	


	public render () {

		let name = globals.current_account ? globals.current_account.first_name : "person with money";

		return (<div>

			<div>Welcome {name}</div>

		</div>);

	}// render;

}// HomePage;


