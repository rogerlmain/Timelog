import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import BaseControl from "client/controls/abstract/base.control";
import LoadList from "client/controls/lists/load.list";

import Container from "client/controls/container";

import { master_pages } from "client/master";


export default class ClientSelector extends BaseControl {

	static defaultProps = { 
		selectedClient: null,
		onChange: null,
	}// defaultProps;


	/*********/


	render () {

		let single_client = (OptionsStorage.client_limit () == 1);

		return single_client ? <Container>
			<div>Client</div>
			<div>Default</div>
		</Container> : <LoadList id={this.props.id}
			getData={() => { return ClientStorage.get_by_company (CompanyStorage.active_company_id ()) }}
			dataIdField="client_id"
			dataTextField="name"
			newOptionPage={master_pages.clients.name} 
			label="Client"
			listHeader="Select a client"
			selectedItem={this.props.selectedClient}
			onChange={this.props.onChange}>
		</LoadList>

	}// render;

}// ClientSelector;