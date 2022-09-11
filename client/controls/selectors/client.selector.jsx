import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import BaseControl from "client/controls/abstract/base.control";
import LoadList from "client/controls/lists/load.list";

import { integer_value, is_null, is_promise } from "client/classes/common";
import { page_names } from "client/master";
import { tracing } from "client/classes/types/constants";


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

		onChange: null,

	}// defaultProps;


	constructor (props) {
		super (props);
		if (tracing) console.log (`${props.id} object created`);
	}// constructor;


	/*********/


	client_selected = () => ((this.state.client_id > 0) || OptionsStorage.single_client ());


	/*********/


	shouldComponentUpdate (new_props, new_state) {

		if (is_null (new_state.client_count)) return !!this.setState ({ client_count: OptionsStorage.client_limit () });

		if (is_null (new_state.client_data)) {
			let data = ClientStorage.get_by_company (CompanyStorage.active_company_id ());
			return !!this.setState ({ client_data: data });
		}// if;

		return true;

	}// shouldComponentUpdate;


	componentDidMount = this.forceRefresh;


	render () {

		if (is_null (this.state.client_data)) return null;// setTimeout (this.forceRefresh ());
		if (this.state.client_count == 0) return null;

		if (this.state.client_count == 1) return <div className="one-piece-form">
			<div>Client</div>
			<div>{this.state.client_data [0].client_name}</div>
		</div>

		return <LoadList id={`${this.props.id}_load_list`} label="Client"

			dataIdField="client_id" dataTextField="name" data={this.state.client_data}

			newButtonPage={this.props.newButton ? page_names.clients : null}

			listHeader={this.props.headerSelectable ? "New client" : "Select a client"}
			selectedItem={this.props.selectedClient}

			onChange={event => this.setState ({ client_id: integer_value (event.target.value) }, () => this.execute (this.props.onChange, event))}>

		</LoadList>

	}// render;

}// ClientSelector;