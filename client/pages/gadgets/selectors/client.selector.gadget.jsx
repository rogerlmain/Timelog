import * as common from "classes/common";

import React from "react";


import Clients from "classes/storage/clients";
import ClientsModel from "models/clients";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";

import SelectList from "controls/select.list";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import { MainContext } from "classes/types/contexts";


export default class ClientSelectorGadget extends BaseControl {


	static contextType = MainContext;


 	/********/


	 state = { 
		clients: null,
		client_selected: false,
	}// state;


	static defaultProps = {

		id: "client_selector",

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


	componentDidMount () {
		Clients.get_all (this.context.company_id).then (data => 
			this.setState ({ 
				company_id: this.context.company_id,
				clients: data
			})
		);
	}// componentDidMount;


	async componentDidUpdate () { 

		if (this.context.company_id != this.state.company_id) {
			this.componentDidMount ();
			return false;
		}// if;

		let data = await Clients.get_all (this.context.company_id);
		
		if (common.matching_objects (this.state.clients, data)) return true;
		
		this.setState ({ clients: data });
		return false;
	}// componentDidUpdate;


	render () {
		return (
			<Container>

				<label htmlFor={this.client_selector_id}>Client</label>

				<EyecandyPanel id={`${this.client_selector_id}_eyecandy_panel`} text="Loading..." eyecandyVisible={common.is_null (this.state.clients)}>
					<SelectList id={this.client_selector_id} data={this.state.clients} value={this.props.selectedClient}
					
						hasHeader={this.props.hasHeader}

						headerText={this.props.hasHeader ? this.props.headerText : null} 
						headerSelectable={this.props.headerSelectable}

						idField="client_id" textField="name"

						onChange={event => {
							this.setState ({ client_selected: true });
							this.execute (this.props.onClientChange, event);							
						}}>

					</SelectList>
				</EyecandyPanel>

			</Container>
		);
	}// render;

}// ClientSelectorGadget;