import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import LoadList from "client/controls/lists/load.list";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";


export default class LoadListTest extends BaseControl {


	state = { client_data: null }


	/********/


	constructor (props) {
		super (props);
		ClientStorage.get_by_company (CompanyStorage.active_company_id ()).then (data => this.setState ({ client_data: data.normalize () }));
	}// constructor;


	/********/


	render () {
		return <div style={{ border: "solid 1px blue" }}>

			<br /><br />

			<div className="one-piece-form">
				<label htmlFor="test_load_list">Clients</label>
				<LoadList id="test_load_list"

					dataIdField="client_id" dataTextField="name" data={this.state.client_data}

					newButtonPage={this.props.newButton ? page_names.clients : null}

					header={"New client"} headerSelectable={true}
					selectedItem={this.props.selectedClient}

					onChange={event => this.forceRefresh ()}>

				</LoadList>
			</div>

			<br /><br />

			<div className="two-column-grid">
				<button onClick={() => this.setState ({ client_data: this.client_list ()})}>Load clients</button>
				<button onClick={() => this.forceRefresh ()}>Force refresh</button>
			</div>

		</div>
	}// render;


}// LoadListTest;


