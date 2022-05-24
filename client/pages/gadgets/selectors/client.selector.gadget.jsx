import * as common from "classes/common";

import React from "react";

import OptionStorage from "client/classes/storage/option.storage";
import ClientStorage from "client/classes/storage/client.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import SelectList from "client/controls/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import FadePanel from "client/controls/panels/fade.panel";

import { is_empty, is_null, not_empty } from "classes/common";
import { master_pages } from "client/master";

import { MasterContext } from "client/classes/types/contexts";


export default class ClientSelectorGadget extends BaseControl {


	 state = { 

		clients: null,

		client_selected: false,
		clients_loading: false,

	}// state;


	static contextType = MasterContext;


	static defaultProps = {

		id: "client_selector",

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


	load_clients = () => ClientStorage.get_by_company (this.context.company_id).then (data => this.setState ({ 
		clients: data,
		clients_loading: false,
	}));


	componentDidMount = () => this.setState ({ clients_loading: true });


	/*********/


	shouldComponentUpdate (next_props, next_state, next_context) {
		if (this.context.company_id != next_context.company_id) this.setState ({ clients_loading: true });
		return true;
	}// shouldComponentUpdate;


	render () {

		let single_client = (OptionStorage.client_limit () == 1);
		let has_clients = ((not_empty (this.state.clients) || !this.props.newOption) && !single_client);

		return <Container>

			<label htmlFor={this.client_selector_id}>Client</label>

			{ single_client ? "Default" : <EyecandyPanel id={`${this.client_selector_id}_eyecandy_panel`} text="Loading..." eyecandyVisible={this.state.clients_loading} onEyecandy={this.load_clients}>

				{ has_clients ? <SelectList id={this.client_selector_id} data={this.state.clients} value={this.props.selectedClient}
							
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