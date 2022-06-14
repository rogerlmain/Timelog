import * as common from "classes/common";

import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import SelectList from "client/controls/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import FadePanel from "client/controls/panels/fade.panel";

import { isset, is_promise, not_empty, not_set } from "classes/common";
import { master_pages } from "client/master";

import { MasterContext } from "client/classes/types/contexts";


export default class ClientSelectorGadget extends BaseControl {


	 state = { 

		client_data: null,

		client_selected: false,
		clients_loading: false,

	}// state;


	static contextType = MasterContext;


	static defaultProps = {

		id: "client_selector",

		clientId: null,
//		clientData: null,

		newOption: true,

		hasHeader: false,
		headerSelectable: false,

		headerText: null,

		selectedClient: null,
		onClientChange: null

	}// defaultProps;


	constructor (props) {
		super (props);
		this.client_selector_id = `${this.props.id}_selecter`;
	}// constructor;


	/*********/


	get_clients = () => {

		if (isset (this.state.client_data)) return this.state.client_data;

		// if (isset (this.props.clientData)) {
		// 	this.setState ({ client_data: this.props.clientData });
		// 	return this.props.clientData;
		// }// if;
		
		let data = ClientStorage.get_by_company (this.context.company_id);
		
		if (is_promise (data)) {
			this.setState ({ clients_loading: true }, () => setTimeout (() => data.then (data => this.setState ({ 
				client_data: data,
				clients_loading: false,
			})), 1000));
			return data;
		}// if;
	
		this.setState ({ client_data: data });
		return data;

	}// get_clients;


	/*********/


	componentDidMount = this.get_clients;


	render () {

		let single_client = (OptionsStorage.client_limit () == 1);
		let has_clients = ((not_empty (this.state.client_data) || !this.props.newOption) && !single_client);

		return <Container>

			<label htmlFor={this.client_selector_id}>Client</label>

			{ single_client ? "Default" : <EyecandyPanel id={`${this.client_selector_id}_eyecandy_panel`} text="Loading..." eyecandyVisible={this.state.clients_loading}>

				{ has_clients ? <SelectList id={this.client_selector_id} data={this.state.client_data} value={this.props.selectedClient}
							
						hasHeader={this.props.hasHeader}

						headerText={this.props.hasHeader ? this.props.headerText : null} 
						headerSelectable={this.props.headerSelectable}

						idField="client_id" textField="name"

						onChange={event => {
							this.setState ({ client_selected: true });
							this.execute (this.props.onClientChange, event);							
						}}>

				</SelectList> : <button onClick={() => { this.context.master_page.setState ({ page: master_pages.clients.name }) }}>New</button> }

			</EyecandyPanel> }

		</Container>

	}// render;

}// ClientSelectorGadget;