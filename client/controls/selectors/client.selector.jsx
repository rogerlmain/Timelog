import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import BaseControl from "client/controls/abstract/base.control";
import LoadList from "client/controls/lists/load.list";

import Container from "client/controls/container";

import { integer_value } from "client/classes/common";
import { page_names } from "client/master";
import { tracing } from "client/classes/types/constants";


export default class ClientSelector extends BaseControl {


	state = { client_id: null }


	static defaultProps = { 

		id: null,
		parent: null,
		
		newButton: false,

		selectedClient: null,

		hasHeader: true,
		headerSelectable: false,

		onChange: null,

	}// defaultProps;


	constructor (props) {
		super (props);
		if (tracing) console.log (`${props.id} object created`);
	}// constructor;


	/*********/


	client_selected = () => { return (this.state.client_id > 0) || OptionsStorage.single_client () }


	/*********/


	render () {

		let multiple_clients = (OptionsStorage.client_limit () > 1);

		return <Container visible={multiple_clients}>
			<LoadList id={this.props.id}

				data={ClientStorage.get_by_company (CompanyStorage.active_company_id ())}
				dataIdField="client_id"
				dataTextField="name"

				newButtonPage={this.props.newButton ? page_names.clients : null}

				label="Client"
				
				listHeader={this.props.headerSelectable ? "New client" : "Select a client"}
				selectedItem={this.props.selectedClient}

				onChange={event => this.setState ({ client_id: integer_value (event.target.value) }, () => this.execute (this.props.onChange, event))}>

			</LoadList>
		</Container>

	}// render;

}// ClientSelector;