import React from "react";

import ClientStorage from "client/classes/storage/client.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import LoadList from "client/controls/lists/load.list";

import { debugging, integer_value, isset } from "client/classes/common";
import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { MasterContext } from "client/classes/types/contexts";
import { page_names } from "client/master";


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
		this.state.selected_client_id = this.props.selectedClient;
		if (debugging (false)) console.log (`${props.id} object created`);
	}// constructor;


	/*********/


	get_client_data = () => ClientStorage.get_by_company (this.context.company_id).then (data => {
		this.setState ({ 
			client_data: data,
			selected_client_id: (Object.keys (data)?.length == 1) ? data [0].client_id : null,
		}, () => this.execute (this.props.onChange, this.state.selected_client_id));
	});


	/*********/


	componentDidMount = this.get_client_data;


	shouldComponentUpdate (new_props, new_state, new_context) {

		if (new_context.company_id != this.context.company_id) this.get_client_data ();

		if (this.props.selectedClient != new_props.selectedClient) return !!this.setState ({ selected_client_id: new_props.selectedClient });


		return true;
	}// shouldComponentUpdate;


	render () {

		let single_client = (isset (this.state.client_data) && (this.state.client_data.length == 1));

		return <Container>

			<label htmlFor={`${this.props.id}_load_list`}>Client<Container visible={single_client}>:</Container></label>

			<LoadList id={`${this.props.id}_load_list`} label="Client" 
			
				listHeader={this.props.headerSelectable ? "New client" : "Select a client"}
				headerSelectable={this.props.headerSelectable} selectedItem={this.props.selectedClient}

				dataIdField="client_id" dataTextField="name" data={this.state.client_data} 
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