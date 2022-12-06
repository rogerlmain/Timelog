import React from "react";

import ClientStorage from "client/classes/storage/client.storage";
import OffshoreModel from "client/classes/models/offshore.model";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import LoadList from "client/controls/lists/load.list";

import { debugging, integer_value, isset, is_null, jsonify } from "client/classes/common";
import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { MasterContext } from "client/classes/types/contexts";
import { page_names } from "client/master";


export default class ClientSelector extends BaseControl {
	

	state = { 
		client_data: null,
		selected_client: null,
	}// state;


	static contextType = MasterContext;


	static defaultProps = { 

		id: null,
		parent: null,
		
		newButton: false,

		selectedClient: null,

		header: null,
		headerSelectable: false,

		inline: true,
		includeOffshoreAccounts: true,

		onChange: null,

	}// defaultProps;


	constructor (props) {
		super (props);
		this.state.selected_client = this.props.selectedClient;
		if (debugging (false)) console.log (`${props.id} object created`);
	}// constructor;


	/*********/


	get_client_data = () => ClientStorage.get_by_company (this.context.company_id, this.props.includeOffshoreAccounts).then (data => {

		let keys = Object.keys (data);

		this.execute (this.props.onLoad, data).then (() => this.setState ({ 
			client_data: data.normalize (),
			selected_client: (keys.length == 1) ? data [keys [0]] : null,
		}, () => this.execute (this.props.onChange, this.state.selected_client)));

	})/* get_client_data */;


	/*********/


	componentDidMount = this.get_client_data;


	shouldComponentUpdate (new_props, new_state, new_context) {
		if (new_context.company_id != this.context.company_id) this.get_client_data ();
		if (this.props.selectedClient != new_props.selectedClient) return !!this.setState ({ selected_client: new_props.selectedClient });
		return true;
	}// shouldComponentUpdate;


	render () {

		let single_client = (isset (this.state.client_data) && (Object.keys (this.state.client_data).length == 1));

		return <Container>

			<label htmlFor={`${this.props.id}_load_list`}>Client<Container visible={single_client}>:</Container></label>

			<LoadList id={`${this.props.id}_load_list`} label="Client" 
			
				header={this.props.header} headerSelectable={this.props.headerSelectable} selectedItem={this.props.selectedClient}

				data={this.state.client_data} 
				
				dataIdField={field => jsonify ({ repository_type: field?.type ?? null, client_id: field?.client_id })}
				
				dataTextField={field => <div className="glyph-list-item">
					<div><img src={OffshoreModel.glyph_image (field)} className="list-glyph" /></div>
					<div>{field.name}</div>
				</div>}

				newButtonPage={this.props.newButton ? page_names.clients : null}

				hAlign={horizontal_alignment.stretch} vAlign={vertical_alignment.center}

				onChange={event => {
					let client_details = JSON.parse (event.currentTarget.getAttribute ("value"));
					this.setState ({ selected_client: client_details }, () => this.execute (this.props.onChange, client_details.client_id));
				}}>
				
			</LoadList>

		</Container>

	}// render;

}// ClientSelector;