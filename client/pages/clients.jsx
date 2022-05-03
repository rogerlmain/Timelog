import React from "react";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import ClientSelectorGadget from "pages/gadgets/selectors/client.selector.gadget";

import ClientForm from "forms/client.form";
import ClientModel from "models/clients";

import { globals } from "client/classes/types/constants";


export default class ClientsPage extends BaseControl {

	state = {
		client_data: null,
		selected_client: null,
		updating: false
	}// state;


	static defaultProps = { id: "clients_page" }


	constructor (props) {
		super (props);
		globals.clients_page = this;
	}// constructor;


	render () {

		let can_create = true; //Options.

 		return <div id={this.props.id} className="top-center-container row-spaced">

			<div className="two-column-grid">
				<ClientSelectorGadget id="client_selector" parent={this} companyId={this.props.companyId}
				
					hasHeader={true} 
					headerSelectable={can_create}
					headerText={can_create ? "New client" : "Select one"}

					selectedClient={this.state.selected_client}

					onClientChange={(event) => this.setState ({ 
						selected_client: event.target.value,
						updating: true 
					})}>

				</ClientSelectorGadget>
			</div>

			<EyecandyPanel id="edit_client_panel" text="Loading..." eyecandyVisible={this.state.updating} 
			
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
	}// render;


}// ClientsPage;