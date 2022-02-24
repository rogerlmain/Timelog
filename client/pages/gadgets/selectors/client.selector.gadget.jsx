import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "client/controls/base.control";

import SelectList from "controls/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import ClientsModel from "client/models/clients";
import { ClientData } from "client/types/datatypes";


export default class ClientSelectorGadget extends BaseControl {


 	client_selector_id = null;


	client_change_handler (event) {
		this.setState ({ client_selected: true });
		this.execute (this.props.onClientChange, event);
	}// client_change_handler;


 	/********/


	static defaultProps = {
		id: "client_selector",

		hasHeader: false,
		headerSelectable: false,
		headerText: null,

		selectedClient: null,
		onClientChange: null
	}// defaultProps;


	state = { 
		clients: null ,
		client_selected: false
	}// ClientSelectorState;


	constructor (props) {
		super (props);
		this.client_selector_id = `${this.props.id}_selecter`;
	}// constructor;


	componentDidMount () {
		ClientsModel.fetch_all ().then (data => this.setState ({ clients: data }));
	}// componentDidMount;


	render () {
		return (
			<div style={{ display: "contents" }}>

				<label htmlFor={this.client_selector_id}>Client</label>

				<EyecandyPanel id={`${this.client_selector_id}_eyecandy_panel`} eyecandyText="Loading..." eyecandyVisible={common.is_null (this.state.clients)}>
					<SelectList id={this.client_selector_id} data={this.state.clients} value={this.props.selectedClient} 
					
						useHeader={this.props.hasHeader}

						headerText={this.props.hasHeader ? this.props.headerText : null} 
						headerSelectable={this.props.headerSelectable}

						idField="client_id" textField="name"

						onChange={event => this.client_change_handler (event)}>

					</SelectList>
				</EyecandyPanel>

			</div>
		);
	}// render;

}// ClientSelectorGadget;