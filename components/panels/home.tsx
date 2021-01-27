import React from "react";
import BaseControl from "components/controls/base.control";

import { globals } from "components/types/globals";


export default class HomePanel extends BaseControl<any> {


	public componentDidMount () {
		setTimeout (() => { globals.home_page.setState ({ content_loaded: true }) });
	}// componentDidMount;


	public render () {

		return (
			<div>Hello World!</div>
		);

	}// render;

}// HomePanel;