import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import LoadList from "client/controls/lists/load.list";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import ClientSelector from "client/controls/selectors/client.selector";


export default class LoadListTest extends BaseControl {


	state = { client_data: null }


	/********/


	constructor (props) {
		super (props);
//		this.state.client_data = this.client_list ();
	}// constructor;


	/********/


	client_list = () => ClientStorage.get_by_company (CompanyStorage.active_company_id ());


	/********/


	render () {
		return <div className="outlined" style={{ border: "solid 1px blue" }}>

			<br /><br />

			<div className="one-piece-form">
				<label htmlFor="test_load_list">Clients</label>
				<LoadList id="test_load_list"

					dataIdField="client_id" dataTextField="name" data={this.state.client_data}

					newButtonPage={this.props.newButton ? page_names.clients : null}

					listHeader={this.props.headerSelectable ? "New client" : "Select a client"}
					selectedItem={this.props.selectedClient}

					onChange={event => alert ("changed")}>

				</LoadList>
			</div>

			<br /><br />

			<ClientSelector id="client_selector" ref={this.client_selector} parent={this}
				headerText="New client"
				selectedClient={this.state.selected_client}>
			</ClientSelector>

			<br /><br />

			<button onClick={() => this.setState ({ client_data: this.client_list ()})}>Load clients</button>

		</div>
	}// render;


}// LoadListTest;


