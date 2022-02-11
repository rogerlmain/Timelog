import React from "react";
import BaseControl from "controls/base.control";

import { globals } from "types/globals";


export default class HomePage extends BaseControl<any> {


	public componentDidMount () {
		setTimeout (() => { globals.master_panel.setState ({ content_loaded: true }) });
	}// componentDidMount;


	public render () {

		return (
			<div>Hello World!</div>
		);

	}// render;

}// HomePage;