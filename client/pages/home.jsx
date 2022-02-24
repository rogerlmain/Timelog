import React from "react";
import BaseControl from "client/controls/base.control";

import { globals } from "types/globals";


export default class HomePage extends BaseControl {

	render () {
		let name = globals.current_account ? globals.current_account.first_name : "person with money";
		return (<div>Welcome {name}</div>);
	}// render;

}// HomePage;

