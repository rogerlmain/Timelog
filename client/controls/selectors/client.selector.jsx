import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import LoadList from "client/controls/lists/load.list";

import { compare, debugging, integer_value, isset } from "client/classes/common";
import { page_names } from "client/master";
import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { MasterContext } from "client/classes/types/contexts";


export default class ClientSelector extends BaseControl {
	

	state = { 
		client_data: null,
		selected_client_id: null,
	}// state;


	static contextType = MasterContext;


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
		this.get_client_data ();
		if (debugging (false)) console.log (`${props.id} object created`);
	}// constructor;


	/*********/


	get_client_data = () => ClientStorage.get_by_company (CompanyStorage.active_company_id ()).then (data => {
		this.setState ({ 
			client_data: data,
			selected_client_id: ((data.length > 1) ? null : data [0].client_id),
		}, () => this.execute (this.props.onChange, this.state.selected_client_id));
	});


	/*********/


	shouldComponentUpdate (new_props, new_state, new_context) {
		if (!compare (new_state.client_data, this.state.client_data)) this.get_client_data ();
		return true;
	}// shouldComponentUpdate;


	render () {

		let single_client = (isset (this.state.client_data) && (this.state.client_data.length == 1));

		return <Container>

			<label htmlFor={`${this.props.id}_load_list`}>Client<Container visible={single_client}>:</Container></label>

			<LoadList id={`${this.props.id}_load_list`} label="Client" 
			
				listHeader={this.props.headerSelectable ? "New client" : "Select a client"}

				dataIdField="client_id" dataTextField="name" data={this.state.client_data} selectedItem={this.props.selectedClient}
				newButtonPage={this.props.newButton ? page_names.clients : null}

				hAlign={horizontal_alignment.stretch} vAlign={vertical_alignment.center}

				onChange={event => {
					let client_id = integer_value (event.target.value);
					this.setState ({ selected_client_id: client_id }, () => this.execute (this.props.onChange, client_id))
				}}>

			</LoadList>

		</Container>

	}// render;

}// ClientSelector;