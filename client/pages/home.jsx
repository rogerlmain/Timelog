import React from "react";
import BaseControl from "client/controls/base.control";
import Credentials from "classes/credentials";

import { isset } from "classes/common";


export default class HomePage extends BaseControl {

	render () {
		let name = Credentials.username ();
		return (<div>Welcome {isset (name) ? name : "person with money"}</div>);
	}// render;

}// HomePage;

