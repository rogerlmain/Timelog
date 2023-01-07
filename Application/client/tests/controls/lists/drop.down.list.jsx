import React from "react";

import ClientStorage from "client/classes/storage/client.storage";

import BaseControl from "client/controls/abstract/base.control";
import DropDownList from "client/controls/lists/drop.down.list";

import "resources/styles/main.css";
import "resources/styles/controls.css";


export default class LoadListTest extends BaseControl {


	state = { data: null }


	componentDidMount () {
		ClientStorage.get_by_company (268, false).then (data => this.setState ({ data: data.normalize () }));
	}/* componentDidMount */


	render = () => <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

<div style={{ width: "400px", height: "200px", border: "solid 1px blue", padding: "1em" }}>
	<DropDownList speed={200} selectedValue={2}
		
		idField="client_id" textField="name"
		data={this.state.data}>

	</DropDownList>

</div>

	</div>


}// LoadListTest;


