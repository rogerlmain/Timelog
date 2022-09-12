import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import LoadList from "client/controls/lists/load.list";

import { debugging, integer_value, is_null, is_promise } from "client/classes/common";
import { page_names } from "client/master";
import { horizontal_alignment } from "client/classes/types/constants";


export default class ClientSelector extends BaseControl {


	state = { 
		client_id: null,
		client_count: null,
		client_data: null,
	}// state;


	static defaultProps = { 

		id: null,
		parent: null,
		
		newButton: false,

		selectedClient: null,

		hasHeader: true,
		headerSelectable: false,

		inline: true,

		onChange: null,

	}// defaultProps;


	constructor (props) {
		super (props);
		this.state.client_data = ClientStorage.get_by_company (CompanyStorage.active_company_id ());
		if (debugging (false)) console.log (`${props.id} object created`);
	}// constructor;


	/*********/


	client_selected = () => ((this.state.client_id > 0) || OptionsStorage.single_client ());


	/*********/


	shouldComponentUpdate (new_props, new_state) {

		if (is_null (new_state.client_count)) return !!this.setState ({ client_count: OptionsStorage.client_limit () });

		if (is_null (new_state.client_data)) {
			let data = ClientStorage.get_by_company (CompanyStorage.active_company_id ());
			if (is_promise (data)) return !data.then (clients => this.setState ({ client_data: clients }));
			return !!this.setState ({ client_data: data });
		}// if;

		return true;

	}// shouldComponentUpdate;


	componentDidMount = this.forceRefresh;


	render () {

		if (this.state.client_count == 1) return <div className="one-piece-form">
			<div>Client</div>
			<div>{this.state.client_data [0].client_name}</div>
		</div>

		return <Container id="client_selector_container">

			<label htmlFor={`${this.props.id}_load_list`}>Client</label>

			<LoadList id={`${this.props.id}_load_list`} label="Client" hAlign={horizontal_alignment.left}

				listHeader={this.props.headerSelectable ? "New client" : "Select a client"}

				dataIdField="client_id" dataTextField="name" data={this.state.client_data} selectedItem={this.props.selectedClient}
				newButtonPage={this.props.newButton ? page_names.clients : null}

				onChange={event => this.setState ({ client_id: integer_value (event.target.value) }, () => this.execute (this.props.onChange, event))}>

			</LoadList>

		</Container>

	}// render;

}// ClientSelector;