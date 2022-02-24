import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import BaseControl, { DefaultProps, DefaultState } from "client/controls/base.control";

import Database from "client/classes/database";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ClientSelectorGadget from "./gadgets/selectors/client.selector.gadget";
import ClientForm from "pages/forms/client.form";
import ClientModel from "models/clients";

import { globals } from "types/globals";
import { ClientData } from "client/types/datatypes";


export default class ClientsPage extends BaseControl {

	state = {
		client_data: null,
		selected_client: null,
		updating: false
	}// state;


	constructor (props) {
		super (props);
		globals.clients_page = this;
	}// constructor;


	render () {
 		return (
			<div id="client_page" className="top-center-container row-spaced">

				<div className="two-column-grid">
					<ClientSelectorGadget id="client_selector" parent={this} 
					
						hasHeader={true} 
						headerSelectable={true}
						headerText="New client"

						selectedClient={this.state.selected_client}

						onClientChange={(event) => this.setState ({ 
							selected_client: event.target.value,
							updating: true 
						})}>

					</ClientSelectorGadget>
				</div>

				<EyecandyPanel id="edit_client_panel" eyecandyText="Loading..." eyecandyVisible={this.state.updating} 
				
					onEyecandy={() => { 
						if (this.state.updating) ClientModel.fetch_by_id (this.state.selected_client).then (data => this.setState ({
							client_data: data,
							updating: false
						}));
					}}>

					<ClientForm formData={this.state.client_data}

					// onDelete={async () => {
					// 	this.setState ({ selected_client: null });
					// 	await this.load_clients ();
					// }} 
					
					// onSave={async () => await this.load_clients () } 
					
					/>
				</EyecandyPanel>

			</div>
		);
	}// render;


}// ClientsPage;