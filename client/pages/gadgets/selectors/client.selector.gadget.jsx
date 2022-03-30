import * as common from "classes/common";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import Container from "controls/container";

import SelectList from "controls/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import ClientsModel from "client/models/clients";


export default class ClientSelectorGadget extends BaseControl {


 	client_selector_id = null;


	client_change_handler (event) {
		this.setState ({ client_selected: true });
		this.execute (this.props.onClientChange, event);
	}// client_change_handler;


 	/********/


	 state = { 
		clients: null ,
		client_selected: false
	}// state;


	static defaultProps = {

		id: "client_selector",
		companyId: null,

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


	componentDidMount () {
		ClientsModel.fetch_by_company (this.props.companyId).then (data => this.setState ({ clients: data }));
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		if (new_props.companyId == this.props.companyId) return true;
		ClientsModel.fetch_by_company (new_props.companyId).then (data => this.setState ({ clients: data }));
		return false;
	}// shouldComponentUpdate;


	render () {
		return (
			<Container>

				<label htmlFor={this.client_selector_id}>Client</label>

				<EyecandyPanel id={`${this.client_selector_id}_eyecandy_panel`} eyecandyText="Loading..." eyecandyVisible={common.is_null (this.state.clients)}>
					<SelectList id={this.client_selector_id} data={this.state.clients} value={this.props.selectedClient}
					
						hasHeader={this.props.hasHeader}

						headerText={this.props.hasHeader ? this.props.headerText : null} 
						headerSelectable={this.props.headerSelectable}

						idField="client_id" textField="name"

						onChange={event => this.client_change_handler (event)}>

					</SelectList>
				</EyecandyPanel>

			</Container>
		);
	}// render;

}// ClientSelectorGadget;