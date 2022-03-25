import React from "react";

import BaseControl from "controls/abstract/base.control";
import Accounts from "classes/storage/accounts";

import { isset } from "classes/common";


export default class HomePage extends BaseControl {


	static defaultProps = { 
		id: "home_page",
		parent: null
	}// defaultProps;


	render () {

		let name = Accounts.username ();

		return (<div id={this.props.id} className="centering-cell">
			<div>Welcome {isset (name) ? name : "person with money"}</div>
		</div>);

	}// render;

}// HomePage;

