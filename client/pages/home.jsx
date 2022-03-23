import React from "react";
import BaseControl from "client/controls/base.control";
import Credentials from "client/classes/storage/credentials";

import { isset } from "classes/common";


export default class HomePage extends BaseControl {

	static defaultProps = { id: "home_page" }

	render () {
		let name = Credentials.username ();
		return (<div id={this.props.id}>Welcome {isset (name) ? name : "person with money"}</div>);
	}// render;

}// HomePage;

